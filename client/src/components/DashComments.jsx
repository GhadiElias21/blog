import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [sortDirection, setSortDirection] = useState('desc');
    
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await fetch(`/api/comment/getcomments?sort=desc`);
          const data = await res.json();
          if (res.ok) {
            setComments(data.comments);
            if (data.comments.length < 12) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.isAdmin) {
        fetchComments();
      }
    }, [currentUser._id]);
    
    const handleShowMore = async () => {
      const startIndex = comments.length;
      try {
        const res = await fetch(
          `/api/comment/getcomments?startIndex=${startIndex}&sort=desc`
        );
        const data = await res.json();
        if (res.ok) {
          setComments((prev) => [...prev, ...data.comments]);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    const handleDeleteComment = async () => {
      setShowModal(false);
      try {
        const res = await fetch(
          `/api/comment/deleteComment/${commentIdToDelete}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments((prev) =>
            prev.filter((comment) => comment._id !== commentIdToDelete)
          );
          setShowModal(false);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    const sortComments = () => {
      const sortedComments = [...comments].sort((a, b) => {
        if (sortDirection === 'asc') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
      setComments(sortedComments);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };
    
    return (
      <div className='table-auto w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-orange-500 scrollbar-thumb-orange-800
     dark:scrollbar-track-blue-700 dark:scrollbar-thumb-blue-500'>
        {currentUser.isAdmin && comments.length > 0 ? (
          <>
            <button onClick={sortComments} className='mb-4 p-2 bg-blue-500 text-white'>
              Sort by Date {sortDirection === 'asc' ? 'Descending' : 'Ascending'}
            </button>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) => (
                <Table.Body className='divide-y' key={comment._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You have no comments yet!</p>
        )}
          <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    );
}
    