import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] =useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (!res.ok) {
          toast.error("Error fetching users");
          return;
        }

        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('user has been deleted')

        setUsers((prev)=>prev.filter((user)=>user._id !== userIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
        
      toast.error(error);
    }
  };

  return (
    <>
      <div
        className="w-full overflow-x-auto scrollbar shadow-md scrollbar-track-orange-500 scrollbar-thumb-orange-800
     dark:scrollbar-track-blue-700 dark:scrollbar-thumb-blue-500"
      >
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>created at</Table.HeadCell>
            <Table.HeadCell>user image</Table.HeadCell>
            <Table.HeadCell>user name</Table.HeadCell>
            <Table.HeadCell>email</Table.HeadCell>
            <Table.HeadCell>admin</Table.HeadCell>
            <Table.HeadCell>delete</Table.HeadCell>
          </Table.Head>
          {users.map((user) => (
            <Table.Body
              key={currentUser._id + Math.floor(Math.random() * 111111)}
              className="divide-y"
            >
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    className=" w-10  h-10 object-cover rounded-full"
                    src={user.profilePicture}
                  />
                </Table.Cell>
                <Table.Cell className="  font-medium text-gray-900 dark:text-white">
                  {user.username}
                </Table.Cell>

                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (
                    <FaCheck className="ml-[15px]" fill="green" />
                  ) : (
                    <ImCross className="ml-[15px]" fill="red" />
                  )}
                </Table.Cell>

                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
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
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            show more
          </button>
        )}
        <Modal
          className="
    "
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14  w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this user?
              </h3>
              <div className=" flex justify-center gap-4">
                <Button onClick={handleDeleteUser} color="failure">
                  Yes, i am sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default DashUser;
