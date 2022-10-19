export function isMailValid(email) {
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
}

export function isPasswordValid(password) {
    //  Password must contain at least
    return (password.match(/[a-z]/) &&          //  One lower char
        password.match(/[A-Z]/) &&          //  One upper char
        password.match(/[1-9]/) &&          //  One number
        password.match(/[\W]/)  &&          //  One special char
        password.match(/^.{8,}$/)           //  Be more than 8 characters long
    );
}

export function sanitize(input) {
    //  TODO
    return input;
}