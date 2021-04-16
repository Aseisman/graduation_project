import React from 'react';
import { notification } from 'antd';
import {AlertOutlined } from '@ant-design/icons';
export default function Loading(props) {
    return (
        notification.open({
            message: props.message,
            description: props.description,
            icon: <AlertOutlined style={{ color: 'rgb(238, 113, 91)' }} />,
        })
    );
}
