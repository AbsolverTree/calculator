const display = document.querySelector('#display');
const displayHistory = document.querySelector('#history-display');
const buttons = document.querySelectorAll('button');

const getResult = (firstNum, operator, secondNum) => {
	const formattedFirstNum = parseFloat(firstNum);
	const formattedSecondNum = parseFloat(secondNum);
	switch (operator) {
		case '+':
			return formattedFirstNum + formattedSecondNum;
		case '-':
			return formattedFirstNum - formattedSecondNum;
		case '*':
			return formattedFirstNum * formattedSecondNum;
		case '/':
			console.log(formattedFirstNum / formattedSecondNum);
			return formattedFirstNum / formattedSecondNum;
	}
};

const customEval = (equation) => {
	const equationArray = [...equation];
	const operators = ['+', '-', '*', '/'];
	const splittedEquation = [];
	let number = '';
	equationArray.forEach((digit, index) => {
		if (!operators.includes(digit)) {
			number += digit;
			if (index + 1 === equationArray.length) {
				splittedEquation.push(number);
			}
		} else {
			if (!number) {
				number += digit;
			} else {
				splittedEquation.push(number);
				number = '';
				splittedEquation.push(digit);
			}
		}
	});

	let splittedEquationInitialLength = splittedEquation.length;
	if (splittedEquation.includes('/', '*')) {
		const indexes = [];
		splittedEquation.forEach((element, index) => {
			if (element === '/' || element === '*') {
				indexes.push(index);
			}
		});

		indexes.forEach((index) => {
			const splittedEquationCurrentLength = splittedEquation.length;
			const removedItems =
				splittedEquationInitialLength - splittedEquationCurrentLength;
			const currentIndex = index - removedItems;
			const firstNum = splittedEquation[currentIndex - 1];
			const secondNum = splittedEquation[currentIndex + 1];
			let numOfItemsToRemove = 3;
			if (splittedEquation < 3) {
				numOfItemsToRemove = 0;
			}
			splittedEquation.splice(
				currentIndex - 1,
				numOfItemsToRemove,
				getResult(firstNum, splittedEquation[currentIndex], secondNum)
			);
		});
	}

	let result;
	if (splittedEquation.length === 1) {
		return parseFloat(splittedEquation[0]);
	}
	splittedEquation.forEach((element, index) => {
		const nextIndex = index + 1;
		if (!result) {
			if (operators.includes(element)) {
				const firstNumber = splittedEquation[index - 1];
				const secondNumber = splittedEquation[nextIndex];
				result = getResult(firstNumber, element, secondNumber);
			}
		} else {
			if (operators.includes(element)) {
				const firstNumber = result;
				const secondNumber = splittedEquation[nextIndex];
				result = getResult(firstNumber, element, secondNumber);
			}
		}
	});
	return result;
};

const errors = {
	INVALID_OPERATION: 'Invalid operation',
	NO_CALCULATION: 'No calculation',
};

const afterDecimal = (num) => {
	if (Number.isInteger(num)) {
		return 0;
	}

	return num.toString().split('.')[1].length;
};

const hasOperator = (equation) => {
	if (['+', '-', '*', '/'].some((n) => equation.includes(n))) {
		return true;
	}
	return false;
};

const calculate = (equation) => {
	try {
		console.log(equation);
		let result = customEval(equation);
		if (afterDecimal(result) >= 12) {
			return `${result.toString(10).slice(0, 12)}...`;
		}
		return result;
	} catch {
		return errors.INVALID_OPERATION;
	}
};

const errorIsBeignShown = () => {
	if (Object.values(errors).includes(display.innerText)) {
		return true;
	}
	return false;
};

const lastInputIsANumber = () => {
	if (!isNaN(display.innerText.slice(-1))) {
		return true;
	}
	return false;
};

buttons.forEach((button) => {
	button.onclick = () => {
		if (displayHistory.innerText != '') {
			display.innerText = '';
			displayHistory.innerText = '';
		}
		if (!errorIsBeignShown()) {
			switch (button.id) {
				case 'clear':
					display.innerText = '';
					displayHistory.innerText = '';
					break;
				case 'backspace':
					if (!errorIsBeignShown()) {
						display.innerText = display.innerText.slice(0, -1);
					}
					break;
				case 'neg':
					if (display.innerText != '' && !errorIsBeignShown()) {
						let number = display.innerText;
						if (hasOperator(display.innerText)) {
							number = calculate(display.innerText);
						}
						display.innerText = -1 * number;
					}
					break;
				case '+':
				case '-':
					if (!lastInputIsANumber()) {
						display.innerText = display.innerText.slice(0, -1);
					}
					display.innerText += button.id;
					break;
				case '*':
				case '/':
					if (display.innerText === '') {
						display.innerText = errors.INVALID_OPERATION;
						setTimeout(() => {
							display.innerText = '';
						}, 2000);
						break;
					}
					if (!lastInputIsANumber()) {
						display.innerText = display.innerText.slice(0, -1);
					}
					display.innerText += button.id;
					break;
				case 'equal':
					if (display.innerText != '') {
						let result = calculate(display.innerText);
						displayHistory.innerText = display.innerText + '=';
						display.innerText = result;
						if (result === errors.INVALID_OPERATION) {
							setTimeout(() => {
								displayHistory.innerText = '';
								display.innerText = '';
							}, 2000);
							break;
						}
						break;
					}
					display.innerText = errors.NO_CALCULATION;
					setTimeout(() => {
						display.innerText = '';
					}, 2000);
					break;
				default:
					display.innerText += button.id;
			}
		}
	};
});

const themeToggleBtn = document.querySelector('.theme-toggler');
const calculator = document.querySelector('.calculator');
const toggleIcon = document.querySelector('.toggler-icon');
let isDark = true;
themeToggleBtn.onclick = () => {
	calculator.classList.toggle('dark');
	themeToggleBtn.classList.toggle('active');
	isDark = !isDark;
};
