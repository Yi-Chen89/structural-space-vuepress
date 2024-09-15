// validate selection
export function selectionValidator(selectedValue) {
  return !!selectedValue;
}

// validate positive number input
export function positiveNumberInputValidator(inputValue) {
  // reset error message
  let errorMessage = '';

  // check input value
  if (inputValue <= 0 || isNaN(inputValue)) {
    errorMessage = 'input must be > 0';
  }

  return errorMessage;
}

// validate non-negative number input
export function nonnegativeNumberInputValidator(inputValue) {
  // reset error message
  let errorMessage = '';

  // check input value
  if (inputValue < 0 || isNaN(inputValue)) {
    errorMessage = 'input must be ≥ 0';
  }

  return errorMessage;
}