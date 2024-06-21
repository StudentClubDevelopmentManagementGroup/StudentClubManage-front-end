import { ref, reactive, h } from "vue";
import type { FormRules } from "element-plus";
import { delay } from "@pureadmin/utils";

import changeEmail from "./changeEmail.vue"

import { addDialog } from "@/components/Dialog";
import { deviceDetection } from "@pureadmin/utils";

interface emailItemProps {
    code: string | number;
    email: string;
    userId: string | number;
}

interface emailProps {
    formInline: emailItemProps;
}

export type { emailItemProps, emailProps };

export const emailUpdatedRules: FormRules = reactive({
    code: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("验证码不能为空"));
            }
            callback();
        },
    }]
});

export function useDialogForm() {
    const formRef = ref()

    function openDialog(title, item?: any, row?: emailItemProps) {
        var state = 0
        if (title === "修改邮箱") {
            state = 1
        }
        addDialog({
            title: title,
            props: {
                formInline: {
                    code: row?.code ?? "",
                    email: item?.mail ?? "",
                    userId: item?.user_id ?? "",
                }
            },
            width: "40%",
            draggable: true,
            fullscreen: deviceDetection(),
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => {
                if (state === 1) {
                    return h(changeEmail, { ref: formRef })
                }
            },
            beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as emailItemProps;
                function chores() {
                    done(); // 关闭弹框
                }
                FormRef.validate((valid: any) => {
                    if (valid) {
                        if (state === 1) {

                        } else {
                            console.log("进入其他")
                        }
                        chores();
                    }
                });
            }
        });
    }

    return {
        openDialog,
    }
}