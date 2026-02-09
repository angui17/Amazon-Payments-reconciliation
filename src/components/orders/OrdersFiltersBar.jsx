import React from "react";
import "../../styles/filters.css";

const OrdersFiltersBar = ({
    statuses = [],
    value = {},
    onChange = () => { },
    onApply = () => { },
    onClear = () => { },
}) => {
    const v = {
        from: value.from || "",
        to: value.to || "",
        last: value.last || "30",
        settlementId: value.settlementId || "",
        orderId: value.orderId || "",
        sku: value.sku || "",
        status: value.status || "",
        search: value.search || "",
    };

    return (
        <div className="filters-card">
            <div className="filters-top">
                {/* LEFT GRID */}
                <div className="filters-left">
                    <div className="filter-group">
                        <div className="filter-label">From</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={v.from}
                            onChange={(e) => onChange({ ...v, from: e.target.value })}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">To</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={v.to}
                            onChange={(e) => onChange({ ...v, to: e.target.value })}
                        />
                    </div>

                    {/* <div className="filter-group">
                        <div className="filter-label">Quick</div>
                        <select
                            className="filter-input"
                            value={v.last}
                            onChange={(e) => onChange({ ...v, last: e.target.value })}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">Settlement ID</div>
                        <input
                            className="filter-input"
                            placeholder="e.g. 23405515541"
                            value={v.settlementId}
                            onChange={(e) => onChange({ ...v, settlementId: e.target.value })}
                        />
                    </div> */}

                    <div className="filter-group">
                        <div className="filter-label">Order ID</div>
                        <input
                            className="filter-input"
                            placeholder="e.g. 111-..."
                            value={v.orderId}
                            onChange={(e) => onChange({ ...v, orderId: e.target.value })}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">SKU</div>
                        <input
                            className="filter-input"
                            placeholder="e.g. 15100BLK"
                            value={v.sku}
                            onChange={(e) => onChange({ ...v, sku: e.target.value })}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="filters-right">
                        <div className="filter-group">
                            <div className="filter-label">Status</div>
                            <select
                                className="filter-input"
                                value={v.status}
                                onChange={(e) => onChange({ ...v, status: e.target.value })}
                            >
                                <option value="">All</option>
                                <option value="C">Completed</option>
                                <option value="P">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="filters-actions" style={{ paddingTop: "10px" }}>
                        <button className="btn btn-sm btn-primary" onClick={onApply}>
                            Apply
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={onClear}>
                            Clear
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default OrdersFiltersBar;
