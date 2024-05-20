interface clubFormItemProps {
    name: string,
    department_id: number | string,
    user_id: number | string,
}

interface clubFormProps {
    formInline: clubFormItemProps;
}

interface departmentItemProps {
    fullName: string,
    abbreviation: string,
}

interface departmentProps {
    formInline: departmentItemProps;
}

interface userItemProps {

}

interface userProps {
    formInline: userItemProps;
}


export type { clubFormItemProps, clubFormProps, departmentItemProps, departmentProps, userItemProps, userProps };