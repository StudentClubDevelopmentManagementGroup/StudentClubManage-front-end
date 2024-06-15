/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

const validateAct = (rule, value, callback) => {
  if (!value) {
    callback(new Error("账号不能为空"));
  } else if (value.length < 6 || value.length > 17) {
    callback(new Error("账号长度为6-17个字符"));
  } else if (!/^[0-9]{6,16}$/.test(value.trim())) {
    callback(new Error("请输入正确的学号"));
  } else {
    callback();
  }
};

const validatePwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error("密码不能为空"));
  } else if (value.length < 4 || value.length > 16) {
    callback(new Error("密码的长度在4~16之间"));
  } else {
    callback();
  }
};

const loginRules = {
  user_id: [
    { require: true, validator: validateAct, trigger: "blur" },
  ],
  pwd: [
    { require: true, validator: validatePwd, trigger: "blur" },
  ],
};

const validateName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("姓名不能为空"));
  } else if (!/^[\u4e00-\u9fa5]{2,4}$/.test(value)) {
    callback(new Error("姓名必须是2到4个汉字"));
  } else {
    callback();
  }
};

const validateUserId = (rule, value, callback) => {
  if (!value) {
    callback(new Error("工号/学号不能为空"));
  } else if (!/^(\d{7,11})$/.test(value)) {
    callback(new Error("工号/学号必须是7~11位"));
  } else {
    callback();
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("密码不能为空"));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error("密码应为8-18位数字、字母的任意组合"));
  } else {
    callback();
  }
};

const validateCode = (rule, value, callback) => {
  if (!value) {
    callback(new Error("验证码不能为空"));
  } else if (value.length !== 7) {
    callback(new Error("验证码长度为4个字符"));
  } else {
    callback();
  }
};

const registRules = {
  name: [
    { validator: validateName, trigger: "blur" },
  ],
  user_id: [
    { validator: validateUserId, trigger: "blur" },
  ],
  department_id: [
    { required: true, message: "学院不能为空", trigger: "blur" },
  ],
  tel: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
  ],
  mail: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  code: [
    { validator: validateCode, trigger: "blur" },
  ],
  pwd: [
    { validator: validatePassword, trigger: "blur" },
  ]
};


export { loginRules, registRules }
