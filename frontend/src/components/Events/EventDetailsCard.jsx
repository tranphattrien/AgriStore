import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { addTocart } from "../../redux/actions/cart";
import SuggestedEvent from "./SuggestedEvent";
const EventDetailsCard = ({ setOpen }) => {
  const { id } = useParams();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [eventData, setEventData] = useState(null);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    async function fetchEventData() {
      try {
        const response = await axios.get(`${server}/event/get-event/${id}`);
        const event = response.data.event;
        setEventData(event);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    }

    fetchEventData();
  }, [id]);

  const filteredSuggestEvents = allEvents?.filter((event) => event._id !== id);

  // const formatDate = (date) => {
  //   const inputDate = typeof date === "string" ? new Date(date) : date;

  //   if (
  //     Object.prototype.toString.call(inputDate) !== "[object Date]" ||
  //     isNaN(inputDate.getTime())
  //   ) {
  //     return "Invalid Date";
  //   }

  //   const day = inputDate.getUTCDate();
  //   const month = inputDate.getUTCMonth() + 1;
  //   const year = inputDate.getUTCFullYear();

  //   const formattedDate = `${day < 10 ? "0" : ""}${day}-${
  //     month < 10 ? "0" : ""
  //   }${month}-${year}`;

  //   return formattedDate;
  // };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (eventData.stock < count) {
        toast.error("Sản phẩm có số lượng giới hạn!");
      } else {
        const carteventData = { ...eventData, qty: count };
        dispatch(addTocart(carteventData));
        toast.success("Sản phẩm đã thêm vào giỏ hàng!");
      }
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = eventData._id + user._id;
      const userId = user._id;
      const sellerId = eventData.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId
        })
        .then((res) => {
          navigate(`/inbox?${res.eventData.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.eventData.message);
        });
    } else {
      toast.error("Vui lòng đăng nhập để nhắn tin");
    }
  };

  const formatDate = (date) => {
    const inputDate = typeof date === "string" ? new Date(date) : date;

    if (
      Object.prototype.toString.call(inputDate) !== "[object Date]" ||
      isNaN(inputDate.getTime())
    ) {
      return "Invalid Date";
    }

    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1;
    const year = inputDate.getUTCFullYear();

    const formattedDate = `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;

    return formattedDate;
  };

  // const startDate = eventData ? formatDate(eventData.start_Date) : "";
  // const finishDate = eventData ? formatDate(eventData.Finish_Date) : "";

  return (
    <div className="flex items-center bg-white">
      {eventData ? (
        <div className={`${styles.section} 800px:w-[80%] mx-auto`}>
          <div className="w-full flex items-center flex-col">
            <h1
              className={`${styles.productTitle} text-[30px] text-center my-4 mt-8 uppercase`}
            >
              {eventData.name}
            </h1>

            <div className="w-full flex items-center flex-col gap-2 p-4 px-8">
              <div className="font-semibold text-[#1b4462]">
                Sự kiện được tạo bởi:
                <Link
                  to={`/shop/preview/${eventData?.shop._id}`}
                  className="text-[#c96665]"
                >
                  {" " + eventData.shop.name}
                </Link>
              </div>

              {/* <div className="font-semibold">
                Thời gian diễn ra sự kiện: Từ{" "}
                <span className="text-[#c96665]">{" " + startDate}</span> đến{" "}
                <span className="text-[#c96665]">{" " + finishDate}</span>
              </div> */}

              <div className="font-semibold">
                Ngày đăng:
                <span className="text-[#c96665]">
                  {" " + eventData.createdAt.slice(0, 10)}
                </span>
              </div>
            </div>

            <div className="mx-auto flex items-center">
              <div className="p-8 pt-0">
                {/* <p className="text-[18px] text-[#1b4462] text-justify leading-8">
                  {eventData.description}
                </p> */}
                <p
                  className="text-[18px] text-[#1b4462] text-justify leading-8"
                  dangerouslySetInnerHTML={{ __html: eventData.description }}
                ></p>

                <img
                  src={`${eventData && eventData.images[select]}`}
                  alt="Event"
                  className="rounded-[8px] my-6 mx-auto w-[80%] h-[80%]"
                />
              </div>
            </div>
          </div>
          {allEvents && <SuggestedEvent data={filteredSuggestEvents} />}
        </div>
      ) : null}
    </div>
  );
};

export default EventDetailsCard;
