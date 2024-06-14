interface departmentItemProps {
    fullName: string,
    abbreviation: string,
}

interface departmentProps {
    formInline: departmentItemProps;
}

export type { departmentItemProps, departmentProps };