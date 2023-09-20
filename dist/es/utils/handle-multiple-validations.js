import isPromise from './is-promise';
/**
 * Rejects `true` values from an array of validations. Returns `true` when there
 * are no errors, or the error object if there are errors.
 *
 * @private
 * @param  {Array} validations
 * @return {Promise<boolean|Any>}
 */
async function handleValidationsAsync(validations) {
    try {
        const result = await Promise.all(validations);
        const maybeFailed = result.filter((val) => typeof val !== 'boolean' && val);
        return maybeFailed.length === 0 || maybeFailed;
    }
    catch (e) {
        return e;
    }
}
/**
 * Rejects `true` values from an array of validations. Returns `true` when there
 * are no errors, or the error object if there are errors.
 *
 * @private
 * @param  {Array} validations
 * @return {boolean|Any}
 */
function handleValidationsSync(validations) {
    const maybeFailed = validations.filter((val) => typeof val !== 'boolean' && val);
    return maybeFailed.length === 0 || maybeFailed;
}
/**
 * Handles an array of validators and returns Promise.all if any value is a
 * Promise.
 *
 * @public
 * @param  {Array} validators Array of validator functions
 * @param  {String} options.key
 * @param  {Any} options.newValue
 * @param  {Any} options.oldValue
 * @param  {Object} options.changes
 * @param  {Object} options.content
 * @return {Promise|boolean|Any}
 */
export default function handleMultipleValidations(validators, { key, newValue, oldValue, changes, content }) {
    let validations = Array.from(validators.map((validator) => {
        const isValidatorClass = (maybeClass) => !!maybeClass.validate;
        if (validator && isValidatorClass(validator)) {
            validator = validator.validate.bind(validator);
        }
        return validator(key, newValue, oldValue, changes, content);
    }));
    if (validations.some(isPromise)) {
        return Promise.all(validations).then(handleValidationsAsync);
    }
    return handleValidationsSync(validations);
}
//# sourceMappingURL=handle-multiple-validations.js.map