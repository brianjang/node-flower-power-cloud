export default class ApiError extends Error {
	constructor(code, body) {
		super();
		this.code = code;
		this.errors = [];

		if (body.errors && body.errors.length > 0) {
			this.errors = body.errors;
		}
		else this.errors.push(body);
		return (this);
	}

	toString() {
		let str = "CODE: " + this.code;

		for (let error of this.errors) {
			str += "\n";

			if (error.error && error.error_description) {
				str += error.error + ": " + error.error_description;
			} else if (error.error_code && error.error_message) {
				str += error.error_code + ": " + error.error_message;
			} else {
				let key = Object.keys(error)[0];
				str += key + ": " + error[key];
			}

		}
		return (str);
	}
}
