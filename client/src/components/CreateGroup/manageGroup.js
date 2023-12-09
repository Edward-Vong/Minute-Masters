import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import ManageGroupLeft from "./manageGroupAssets/manageGroupLeft";
import NameList from "./manageGroupAssets/nameList";

const ManageGroup = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <ManageGroupLeft />
                </div>
                <div className="col shadow rounded-3">
                    <NameList />
                </div>
            </div>
        </div>
    );
};

export default ManageGroup;
 