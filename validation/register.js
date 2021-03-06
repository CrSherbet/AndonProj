const isEmpty = require('./is-empty');
const Validator = require('validator');


module.exports = function validateRgisterInput(data){
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username: '';
    data.password = !isEmpty(data.password) ? data.password: '';
    data.password2 = !isEmpty(data.password2) ? data.password2: '';
    data.gitURL = !isEmpty(data.gitURL) ? data.gitURL: '';
    data.imgURL = !isEmpty(data.imgURL) ? data.imgURL: '';

    if(!Validator.isLength(data.username, { min: 6, max: 30 })){
        errors.username = 'Name must be between 6 and 30 characters';
    }

    if(Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    if(!Validator.isURL(data.gitURL)) {
        errors.gitURL= 'Git URL is invalid';
    }

    if(Validator.isEmpty(data.gitURL)) {
        errors.gitURL= 'Git URL field is required';
    }

    if(!Validator.isURL(data.imgURL)) {
        errors.imgURL= 'Image URL is invalid';
    }

    if(Validator.isEmpty(data.imgURL)) {
        errors.imgURL= 'Image URL field is required';
    }


    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};