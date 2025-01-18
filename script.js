'use strict';

// BANKIST APP
// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-10-20T10:01:17.194Z',
    '2024-10-15T23:36:17.929Z',
    '2024-10-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Arafat Howlader',
  movements: [55000, 300, -150, -7910, -3210, -10040, 85500, -300],
  interestRate: 1.5,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2025-01-10T14:43:26.374Z',
    '2025-01-15T18:49:59.371Z',
    '2025-01-13T12:01:20.894Z',
  ],
  currency: 'BDT',
  locale: 'bn-BD',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////
// Functions

const formatMovementDate = date => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return '7 days ago';

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${dat///////e.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(currentAccount.locale).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combineMovesDate = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combineMovesDate.sort((a, b) => a.movement - b.movement);

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combineMovesDate.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency); //`${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency); // `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //in each call , print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //when timer is at 0 , log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 100;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting with the API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // numeric / long
      year: '2-digit', // numeric / long
      weekday: 'long',
    };
    // const local = navigator.language;
    // console.log(local);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000); // Add movement
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
// Base 10 is 0 to 9
// Base 2 is 0 and 1

//Conversion
console.log(Number('23')); // 23
console.log(+'23'); // 23

//Parsing
console.log(Number.parseInt('29jk'));

console.log(Number.parseInt('2.4rem'));
console.log(Number.parseFloat('2.4rem'));

console.log(parseFloat('2.4rem')); //It will work without (Number) also. But in modern javaScript it incourg to use (Number).

//Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20x'));
console.log(Number.isNaN(20 / 0)); //Infinity

//Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));

//
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));


//Square root.
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

//Max and Min number
console.log(Math.max(5, 6, 34, 23, 64, 6));
console.log(Math.max(5, 6, 34, '23', 64, 6)); // Wil same result as first array.
console.log(Math.max(5, 6, 34, '23px', 64, 6)); // Nan

console.log(Math.min(5, 6, 34, '23px', 64, 6)); // NaN

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

//Rounding integers

console.log(Math.round(23.3)); // under 5 will round down.
console.log(Math.round(23.9)); // over 5 will round up.

console.log(Math.ceil(23.3)); // always round up
console.log(Math.ceil(23.9)); // always round up

console.log(Math.ceil(-23.3));
console.log(Math.floor(23.3));

console.log(Math.floor(-23.1));

console.log(Math.trunc(-23.3));

//Rounding decimals

//primitive doesn't have method
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(2));

//Reminder operator - it returns the reminder - vognangsho
console.log(5 % 2);

//if the number is visible by 2, then thats a even number.
console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(2));
*/
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'blue';
  });
});

/*
// underscore in number, is numeric separators. It's shows how is the number ex:
const diameter = 245_464_432_00;
console.log(diameter); // 24546443200

// Numeric operators doesn't support in string. It always support number.

console.log(34324243763762748624786372463784634786n); // BigInt
console.log(BigInt(34324243763762748624786372463784634786)); // Second way

//operations
console.log(10000n + 10000n);

const huge = 354156745165751456n;
const num = 23;

console.log(huge * BigInt(num));

console.log(huge + ' Is really big num');

//Divisions
console.log(10n / 3n);
console.log(10 / 3);

// Create a date
const now2 = new Date();
console.log(now2);

console.log(new Date('Aug 02 2939 23:12:44'));
console.log(new Date('December 24, 2014'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // to find 3 days later

//Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142235380000)); //get the exact date from millisecond

const future2 = new Date(2037, 10, 19, 15, 23);
console.log(+future2);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);


//Basic formatting
const num = 3884764.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,

  // minimumFractionDigits: 2,
  // maximumFractionDigits: 2,
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/
/* const ingredients = ['Tomato', 'Spinach'];
const timer = setTimeout(
  (int1, int2) => console.log(`Timer 1 finished ${int1} and ${int2}`),
  3000,
  ...ingredients
);
console.log('waiting...');
if (ingredients.includes('Spinach')) clearTimeout(timer);

const interval = setInterval(function () {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  console.log(`${hour}:${min}:${sec}`);

  // if (hour === 0 && min === 0 && sec === 0) {
  //   clearInterval(interval);
  // }
  // clearInterval(interval);

  // console.log(now);
}, 1000);
 */

const ingredients = ['Tomato', 'Spinach'];
const PizzaTimer = setTimeout(
  (ing3, ing4) => {
    console.log(`Here is your pizza with ${ing3} and ${ing4}🍕`);
  },
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('Spinach')) {
  clearTimeout(PizzaTimer);
  console.log('Pizza has spinach');
}

// parsing - starting should be a number
console.log(Number.parseInt('41px'));

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
console.log(randomInt(10, 20));

const isEven = num => num % 2 === 0;

console.log(isEven(45));

// Biggest number in JS
console.log(2 ** 53 - 1);

// Month in JavaScript is 0 based. Like 0 means January, and 1 means February.
new Date();
new Date('Jan, 3, 2022');

const future = new Date(2037, 10, 17, 23);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 11, 4), new Date(2037, 11, 24));
console.log(days1);

// Unit, percent, currency There are three(3) Intl.NumberFormat
const num = 34454532.343;

const option = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  useGrouping: false,
};
console.log('BD:', new Intl.NumberFormat('bn-BD', option).format(num));
console.log('US:', new Intl.NumberFormat('en-US', option).format(num));
console.log('Syria:', new Intl.NumberFormat('ar-SY', option).format(num));
console.log('Germen:', new Intl.NumberFormat('de-DE', option).format(num));

console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);

// We can pass Argument in this function also.
// It's like, all the argument after the delay argument, is the function argument.
const ingredients2 = ['olives', 'spinach'];
const PizzaTimer2 = setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} & ${ing2}🍕`);
  },
  1000,
  ...ingredients2
);
console.log('waiting.....');
if (ingredients2.includes('spinach')) clearTimeout(PizzaTimer2);

setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  // console.log(`${hours}:${minutes}:${seconds}`);
}, 1000);

////////////////////////////////
(function ($) {
  'use strict';
  $.fn.rProgressbar = function (options) {
    options = $.extend(
      {
        percentage: null,
        ShowProgressCount: true,
        duration: 1000,
        backgroundColor: 'none',
        borderRadius: 'none',
        width: '100%',
        height: '3px',
        overflow: 'visible',
      },
      options
    );
    return this.each(function (index, el) {
      $(el).html(
        '<div class="progressbar"><div class="proggress"> <div class="indicator"></div></div><div class="percentCount"></div>'
      );
      var progressFill = $(el).find('.proggress');
      var proggressIndicator = $(el).find('.indicator');
      var progressBar = $(el).find('.progressbar');
      var percentCount = $(el).find('.percentCount');
      progressFill.css({
        backgroundColor: options.fillBackgroundColor,
        height: options.height,
        borderRadius: options.borderRadius,
      });
      progressBar.css({
        width: options.width,
        backgroundColor: options.backgroundColor,
        borderRadius: options.borderRadius,
      });
      proggressIndicator.css({ overflow: options.overflow });
      var updateProgress = function () {
        progressFill.animate(
          { width: options.percentage + '%' },
          {
            duration: options.duration,
            step: function (x) {
              if (options.ShowProgressCount) {
                percentCount.text(Math.round(x) + '%');
              }
            },
          }
        );
      };
      $(this).waypoint(updateProgress, {
        offset: '100%',
        triggerOnce: true,
      });
    });
  };
  // Initialize progress bars
  $('.progressbar-one').rProgressbar({
    percentage: 90,
  });
  $('.progressbar-two').rProgressbar({
    percentage: 80,
  });
  $('.progressbar-three').rProgressbar({
    percentage: 92,
  });
  $('.progressbar-four').rProgressbar({
    percentage: 59,
  });
  $('.progressbar-five').rProgressbar({
    percentage: 86,
  });
  $('.progressbar-six').rProgressbar({
    percentage: 90,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-seven').rProgressbar({
    percentage: 75,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-eight').rProgressbar({
    percentage: 85,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-nine').rProgressbar({
    percentage: 80,
    height: '8px',
    borderRadius: '4px',
  });

  // Scroll-based progress bar trigger
  $(window).on('scroll', function () {
    $('.progressbar .proggress').each(function () {
      var bottom_of_object = $(this).offset().top + $(this).outerHeight();
      var bottom_of_window = $(window).scrollTop() + $(window).height();
      var myVal = $(this).attr('data-value');
      if (bottom_of_window > bottom_of_object) {
        $(this)
          .css({
            width: myVal,
          })
          .siblings('.percentCount')
          .text(myVal);
      }
    });
  });
})(jQuery)
(function ($) {
  'use strict';
  // Animated Progress Bar
  $('[progress-bar]').each(function () {
    $(this)
      .find('.progress-fill')
      .animate(
        {
          width: $(this).attr('data-percentage'),
        },
        2000
      );

    $(this)
      .find('.progress-number-mark')
      .animate(
        { left: $(this).attr('data-percentage') },
        {
          duration: 2000,
          step: function (now, fx) {
            var data = Math.round(now);
            $(this)
              .find('.percent')
              .html(data + '%');
          },
        }
      );
  });
})(jQuery);

/////////////////// ------
(function ($) {
  'use strict';
  $.fn.rProgressbar = function (options) {
    options = $.extend(
      {
        percentage: null,
        ShowProgressCount: true,
        duration: 1000,
        backgroundColor: 'none',
        borderRadius: 'none',
        width: '100%',
        height: '3px',
        overflow: 'visible',
      },
      options
    );

    return this.each(function (index, el) {
      $(el).html(
        '<div class="progressbar"><div class="proggress"> <div class="indicator"></div></div><div class="percentCount"></div>'
      );
      var progressFill = $(el).find('.proggress');
      var proggressIndicator = $(el).find('.indicator');
      var progressBar = $(el).find('.progressbar');
      var percentCount = $(el).find('.percentCount');
      progressFill.css({
        backgroundColor: options.fillBackgroundColor,
        height: options.height,
        borderRadius: options.borderRadius,
      });
      progressBar.css({
        width: options.width,
        backgroundColor: options.backgroundColor,
        borderRadius: options.borderRadius,
      });
      proggressIndicator.css({ overflow: options.overflow });
      var updateProgress = function () {
        progressFill.animate(
          { width: options.percentage + '%' },
          {
            duration: options.duration,
            step: function (x) {
              if (options.ShowProgressCount) {
                percentCount.text(Math.round(x) + '%');
              }
            },
          }
        );
      };
      $(this).waypoint(updateProgress, { offset: '100%', triggerOnce: true });
    });
  };

  // Initialize progress bars
  $('.progressbar-one').rProgressbar({
    percentage: 90,
  });
  $('.progressbar-two').rProgressbar({
    percentage: 80,
  });
  $('.progressbar-three').rProgressbar({
    percentage: 92,
  });
  $('.progressbar-four').rProgressbar({
    percentage: 59,
  });
  $('.progressbar-five').rProgressbar({
    percentage: 86,
  });
  $('.progressbar-six').rProgressbar({
    percentage: 90,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-seven').rProgressbar({
    percentage: 75,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-eight').rProgressbar({
    percentage: 85,
    height: '8px',
    borderRadius: '4px',
  });
  $('.progressbar-nine').rProgressbar({
    percentage: 80,
    height: '8px',
    borderRadius: '4px',
  });

  // Scroll-based progress bar trigger
  $(window).on('scroll', function () {
    var bottom_of_window = $(window).scrollTop() + $(window).height();

    $('.progressbar').each(function () {
      var bottom_of_object = $(this).offset().top + $(this).outerHeight();

      if (bottom_of_window > bottom_of_object) {
        $(this).find('.proggress').each(function () {
          var myVal = $(this).attr('data-value');
          $(this)
            .css({
              width: myVal,
            })
            .siblings('.percentCount')
            .text(myVal);
        });

        $('[progress-bar]').each(function () {
          $(this)
            .find('.progress-fill')
            .animate(
              {
                width: $(this).attr('data-percentage'),
              },
              2000
            );

          $(this)
            .find('.progress-number-mark')
            .animate(
              { left: $(this).attr('data-percentage') },
              {
                duration: 2000,
                step: function (now, fx) {
                  var data = Math.round(now);
                  $(this)
                    .find('.percent')
                    .html(data + '%');
                },
              }
            );
        });
      }
    });
  });
})(jQuery);


