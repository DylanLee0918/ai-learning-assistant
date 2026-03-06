import React from "react";

const PageHeader = ({ title, subTitle, children }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
                <h1 className="">{title}</h1>
                {subTitle && <p className="text-slate-500 text-sm">{subTitle}</p>}
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};

export default PageHeader;
