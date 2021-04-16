import React from 'react';
import { Spin } from 'antd';
import "./index.css";
export default function Loading() {
    return (
        <div class="loading">
            <Spin />
        </div>
    );
}
