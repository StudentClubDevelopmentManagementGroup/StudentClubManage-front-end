interface clubFormItemProps {
    club_name: string,
    department_id: number | string,
    user_id: number | string,
}

interface clubFormProps {
    formInline: clubFormItemProps;
}

export type { clubFormItemProps, clubFormProps }