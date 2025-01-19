import { Button, Radio, Space,  Tag } from 'antd';
import React, { useState } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
const bottomOptions = [
  { label: 'bottomLeft', value: 'bottomLeft' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomRight', value: 'bottomRight' },
  { label: 'none', value: 'none' },
];

function FoodList() {

  return (
    <>
      <div className='mt-12'>
        Hello Food List
      </div>
    </>
  );
}

export default FoodList;
