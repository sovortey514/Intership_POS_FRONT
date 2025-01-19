import { Button, Radio, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
const bottomOptions = [
  { label: 'bottomLeft', value: 'bottomLeft' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomRight', value: 'bottomRight' },
  { label: 'none', value: 'none' },
];

const columns = [
  
{
    title: 'No',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
},
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Category',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Purchase Date',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Location',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Status',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle " >
        <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
        <Button icon={<EyeOutlined />} style={{ marginRight: 8 }} />
        <Button icon={<DeleteOutlined />} />
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool'],
  },
];

function HistoryCount() {
  const [size, setSize] = useState('large');
  const [top, setTop] = useState('topLeft');
  const [bottom, setBottom] = useState('bottomRight');

  return (
    <>
      {/* <Button size={size} className='bg-yellow-500 absolute right-6'>
        +Create
      </Button> */}
      <div className='mt-12'>
        Hello history of asset count
      </div>
    </>
  );
}

export default HistoryCount;
