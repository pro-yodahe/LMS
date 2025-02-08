const AuthLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="h-full flex items-start justify-center">
            {children}
        </div>
    );
};

export default AuthLayout;
