const validateName = (rule, value, callback) => {
    console.log(value);
    if (!value) {
        callback(new Error("名称不能为空"));
    } else if (value == null) {
        callback(new Error("名称不能为空"));
    } else {
        callback();
    }
};

const validateId = (rule, value, callback) => {
    console.log(value);
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
        { require: true, validator: validateName, trigger: "blur" }
    ],
    department_id: [
        { require: true, validator: validateId, trigger: "blur" }
    ]
}

const validateUserId = (rule, value, callback) => {
    console.log(value);
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
        { require: true, validator: validateUserId, trigger: "blur" }
    ]
}