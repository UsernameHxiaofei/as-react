export const getErrorInfo = (rules, value, key) => {
  let formValidatorError = [];
  if (Array.isArray(rules) && rules.length) {
    formValidatorError = rules.reduce(
      (errInfo, item) => {
        const { validatorFn, errMsg = '' } = item || {};
        if (validatorFn && typeof validatorFn === 'function') {
          const inValid = !validatorFn(value);
          if (inValid) {
            errInfo.errMsg.push(errMsg);
          }
        }
        return errInfo;
      },
      { key, errMsg: [] },
    );
  }
  return formValidatorError;
};
export const isNotNullOrUndefined = value => typeof value !== 'undefined' || value !== null;
