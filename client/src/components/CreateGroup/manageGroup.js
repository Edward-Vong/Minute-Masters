import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import ManageGroupLeft from "./manageGroupAssets/manageGroupLeft";

const ManageGroup = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <ManageGroupLeft />
                </div>
                <div className="col shadow rounded-3 text-center">
                    some content
                </div>
            </div>
        </div>
    );
};

export default ManageGroup;
 