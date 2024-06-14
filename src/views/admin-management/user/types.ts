interface userItemProps {
    pwd: string,
    rePwd: string
}

interface userProps {
    formInline: userItemProps;
}

export type { userItemProps, userProps };