import React from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from "../../components/Layout/Header";

const ShopPreviewPage = () => {
  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5]`}>
        <div className="w-full 800px:flex justify-between">
          <div className="800px:w-[25%] bg-[#fff] rounded-[4px] shadow-sm 800px:overflow-y-scroll [&::-webkit-scrollbar]:hidden 800px:h-[90vh] 800px:sticky top-10 left-0 z-10">
            <ShopInfo isOwner={false} />
          </div>
          <div className="800px:w-[72%] mt-5 800px:mt-['unset'] rounded-[4px]">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPage;
