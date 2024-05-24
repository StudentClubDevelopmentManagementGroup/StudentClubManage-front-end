interface clubFormItemProps {
    club_name: string,
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
    pwd: string,
    rePwd: string
}

interface userProps {
    formInline: userItemProps;
}


export type { clubFormItemProps, clubFormProps, departmentItemProps, departmentProps, userItemProps, userProps };