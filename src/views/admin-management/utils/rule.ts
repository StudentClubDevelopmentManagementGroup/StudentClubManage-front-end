const validateName = (rule, value, callback) => {
    if (!value) {
        callback(new Error("名称不能为空"));
    } else if (value == null) {
        callback(new Error("名称不能为空"));
    } else {
        callback();
    }
};

const validateId = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请选择院系"));
    } else if (value == null) {
        callback(new Error("请选择院系"));
    } else {
        callback();
    }
};

export const addBaseRules = {
    name: [
        { required: true, validator: validateName, trigger: "blur" }
    ],
    department_id: [
        { required: true, validator: validateId, trigger: "blur" }
    ]
}

const validateUserId = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入工号"));
    } else if (value == null) {
        callback(new Error("请输入工号"));
    } else {
        callback();
    }
};

export const setManagerRules = {
    user_id: [
        { required: true, validator: validateUserId, trigger: "blur" }
    ]
}

const validateFullName = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入学院名称"))
    } else if (value == null) {
        callback(new Error("请输入学院名称"))
    } else {
        callback();
    }
}

const validateAbbreviation = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入学院简称"))
    } else if (value == null) {
        callback(new Error("请输入学院简称"))
    } else {
        callback();
    }
}

export const addDepartmentRules = {
    fullName: [
        { required: true, validator: validateFullName, trigger: 'blur' }
    ],
    abbreviation: [
        { required: true, validator: validateAbbreviation, trigger: 'blur' }
    ]
}




export const modifyDepartmentRules = {
    fullName: [
        { required: true, validator: validateFullName, trigger: 'blur' }
    ],
    abbreviation: [
        { required: true, validator: validateAbbreviation, trigger: 'blur' }
    ]
}