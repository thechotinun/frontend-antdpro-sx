import { dataPost, tablePosts } from '@/services/apis/posts.api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [page, setPage] = useState<number>();
  const [limit, setLimit] = useState<number>();
  const [pagination, setPagination] = useState<API.Meta>();
  const [title, setTitle] = useState<string>();
  const [postedBy, setPostedBy] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [postedAt, setPostedAt] = useState<string>();
  const [idPost, setIdPost] = useState<number>();
  const [posts, setPosts] = useState<API.Posts[]>();
  const [post, setPost] = useState<API.Post | undefined>(undefined);

  const getTablePosts = async () => {
    try {
      const msg = await tablePosts({
        page: page,
        limit: limit,
        title: title,
        postedBy: postedBy,
        tags: tags,
        postedAt: postedAt,
      });
      setPosts(msg.data);
      setPagination(msg.meta);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTablePosts();
  }, [page, limit, title, postedBy, tags, postedAt]);

  const getDataPosts = async () => {
    try {
      const msg = await dataPost(idPost);
      setPost(msg.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idPost) getDataPosts();
  }, [idPost]);

  const columns: ProColumns<API.Posts>[] = [
    {
      title: 'title',
      dataIndex: 'title',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              if (entity.id) setIdPost(entity.id);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'tags',
      dataIndex: 'tags',
      render: (dom) => {
        const data =
          dom !== '-' && dom?.map((res: string, ind: number) => <div key={ind}>{res}</div>);
        return <>{data}</>;
      },
      fieldProps: {
        placeholder: 'multiple tags please add "," between tag',
      },
    },
    {
      title: 'postedBy',
      dataIndex: 'postedBy',
    },
    {
      title: 'postedAt',
      dataIndex: 'postedAt',
      search: false,
      sorter: true,
      render: (dom) => {
        if (dom === undefined) {
          return <p>Invalid date</p>;
        }
        const dateObject = new Date(dom);
        if (isNaN(dateObject.getTime())) {
          return <p>Invalid date format</p>;
        }
        const formattedDate = dateObject.toLocaleString();
        return <>{formattedDate}</>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Posts, API.PageParams>
        headerTitle={'Posts Table'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          searchText: 'Search',
        }}
        dataSource={posts}
        pagination={{
          current: pagination?.currentPage,
          pageSize: pagination?.itemsPerPage,
          total: pagination?.totalPages,
          showSizeChanger: false,
          onChange: (newCurrent, newPageSize) => {
            setPage(newCurrent);
            setLimit(newPageSize);
          },
        }}
        request={async (params: any, sort: any) => {
          // console.log(params, sort, filter);
          if (params?.title) {
            setTitle(params?.title);
          } else {
            setTitle(undefined);
          }

          if (params?.postedBy) {
            setPostedBy(params?.postedBy);
          } else {
            setPostedBy(undefined);
          }

          if (params?.tags) {
            const tagsArray = params?.tags
              .split(',')
              .map((item: string) => item.trim())
              .filter((item: string) => item !== '');
            setTags([...tagsArray]);
          } else {
            setTags([]);
          }

          if (sort.postedAt === 'ascend') {
            setPostedAt('ASC');
          } else if (sort.postedAt === 'descend') {
            setPostedAt('DESC');
          } else {
            setPostedAt(undefined);
          }
        }}
        columns={columns}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
          setPost(undefined);
        }}
        closable={false}
      >
        <div>
          <div>Title : {post?.title}</div>
          <div>tags : {post?.tags}</div>
          <div>postedAt : {post?.postedAt}</div>
          <div>postedBy : {post?.postedBy}</div>
          <div>
            {post?.content && (
              <div>
                Content : <div dangerouslySetInnerHTML={{ __html: post?.content }} />
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
