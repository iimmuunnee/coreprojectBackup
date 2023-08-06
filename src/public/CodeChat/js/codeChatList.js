const chatSocket = io("/CodeChat");
// 페이징 js

// 페이징 요소들을 가져오
const pagination = document.querySelector(".pagination");

if (pagination) {
  const paginationNumbers = document.querySelectorAll(".pagination__number");
  let paginationActiveNumber = document.querySelector(
    ".pagination__number--active"
  );
  const paginationNumberIndicator = document.querySelector(
    ".pagination__number-indicator"
  );
  const paginationLeftArrow = document.querySelector(
    ".pagination__arrow:not(.pagination__arrow--right)"
  );
  const paginationRightArrow = document.querySelector(
    ".pagination__arrow--right"
  );

  // 페이징 인디케이터를 요소 위치에 맞게 조정하는 함수
  const postionIndicator = (element) => {
    const paginationRect = pagination.getBoundingClientRect();
    const paddingElement = parseInt(
      window.getComputedStyle(element, null).getPropertyValue("padding-left"),
      10
    );
    const elementRect = element.getBoundingClientRect();
    paginationNumberIndicator.style.left = `${
      elementRect.left + paddingElement - paginationRect.left
    }px`;
    paginationNumberIndicator.style.width = `${
      elementRect.width - paddingElement * 2
    }px`;
    if (element.classList.contains("pagination__number--active")) {
      paginationNumberIndicator.style.opacity = 1;
    } else {
      paginationNumberIndicator.style.opacity = 0.2;
    }
  };

  // 활성화된 페이징 번호를 설정하는 함수
  const setActiveNumber = (element) => {
    if (element.classList.contains("pagination__number--active")) return;
    element.classList.add("pagination__number--active");
    paginationActiveNumber.classList.remove("pagination__number--active");
    paginationActiveNumber = element;
    setArrowState();
  };

  // 화살표 상태를 설정하는 함수
  const disableArrow = (arrow, disable) => {
    if (
      (!disable && !arrow.classList.contains("pagination__arrow--disabled")) ||
      (disable && arrow.classList.contains("pagination__arrow--disabled"))
    )
      return;
    if (disable) {
      arrow.classList.add("pagination__arrow--disabled");
    } else {
      arrow.classList.remove("pagination__arrow--disabled");
    }
  };

  // 화살표 상태를 갱신하는 함수
  const setArrowState = () => {
    const previousElement = paginationActiveNumber.previousElementSibling;
    const nextElement = paginationActiveNumber.nextElementSibling;
    if (previousElement.classList.contains("pagination__number")) {
      disableArrow(paginationLeftArrow, false);
    } else {
      disableArrow(paginationLeftArrow, true);
    }

    if (nextElement.classList.contains("pagination__number")) {
      disableArrow(paginationRightArrow, false);
    } else {
      disableArrow(paginationRightArrow, true);
    }
  };

  // 이전 화살표 클릭 시 이벤트 처리
  paginationLeftArrow.addEventListener("click", () => {
    setActiveNumber(paginationActiveNumber.previousElementSibling);
    postionIndicator(paginationActiveNumber);
  });

  // 다음 화살표 클릭 시 이벤트 처리
  paginationRightArrow.addEventListener("click", () => {
    setActiveNumber(paginationActiveNumber.nextElementSibling);
    postionIndicator(paginationActiveNumber);
  });

  // 각 페이징 번호 클릭 시 이벤트 처리
  Array.from(paginationNumbers).forEach((element) => {
    element.addEventListener("click", () => {
      setActiveNumber(element);
      postionIndicator(paginationActiveNumber);
    });

    element.addEventListener("mouseover", () => {
      postionIndicator(element);
    });

    element.addEventListener("mouseout", () => {
      postionIndicator(paginationActiveNumber);
    });
  });

  postionIndicator(paginationActiveNumber);
}

// 페이지 view js

// 페이지를 보여주는 기능과 페이징 처리를 위한 변수들을 설정,  96~121번쨰 줄은 게시글 및 페이징이 10개가 넘어가면 다음 페이지로 넘어가게 만든 js (없애고 back에서 구현해도 됌)
document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 10;
  let currentPage = 1;
  let filteredItems = [];

  // 해당 페이지에 보여줄 아이템들을 선택하여 표시
  function showItems(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    filteredItems.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.style.display = "table-row";
      } else {
        item.style.display = "none";
      }
    });
  }

  // 페이징 번호 클릭 시 처리하는 함수
  function handlePagination(page) {
    currentPage = page;
    showItems(currentPage);
    updatePaginationButtons();
  }

  // 페이징 버튼 상태를 업데이트
  function updatePaginationButtons() {
    const paginationButtons = document.querySelectorAll(".pagination__number");
    paginationButtons.forEach((button) => {
      if (parseInt(button.textContent) === currentPage) {
        button.classList.add("pagination__number--active");
      } else {
        button.classList.remove("pagination__number--active");
      }
    });
  }

  // 페이지 번호 클릭 시 페이징 처리
  const paginationButtons = document.querySelectorAll(".pagination__number");
  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = parseInt(this.textContent);
      handlePagination(page);
    });
  });

  // 페이징 화살표 클릭 시 페이징 처리
  const paginationArrows = document.querySelectorAll(".pagination__arrow");
  paginationArrows.forEach((arrow) => {
    arrow.addEventListener("click", function () {
      const isRightArrow = this.classList.contains("pagination__arrow--right");
      if (isRightArrow) {
        currentPage++;
      } else {
        currentPage--;
      }

      if (currentPage < 1) currentPage = 1;
      const maxPage = Math.ceil(filteredItems.length / itemsPerPage);
      if (currentPage > maxPage) currentPage = maxPage;

      handlePagination(currentPage);
    });
  });

  // 페이지에 보여줄 아이템들을 선택
  const items = document.querySelectorAll("#board-list tbody tr");
  items.forEach((item) => {
    item.style.display = "table-row";
    filteredItems.push(item);
  });

  // 초기에 첫 페이지를 보여줌
  showItems(currentPage);
});

// 팝업창 js

// 모달창 열기 함수
function openModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "block";
}

// 모달창 닫기 함수
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

// ---------------------------------------------------------------------------------------------------------------------------------------------
// socket.io 사용

// 방의 이름을 입력받고 방에 입장할 수 있는 페이지 담당 js

const $make_room_form = document.getElementById("make_room_form"); // 방 정보 입력 폼
const $room_name = document.getElementById("room_name"); // 방 이름 입력 input
const $chatRoomMethod = document.getElementById("chatRoomMethod"); // 방의 채팅 방식 select
const $dev_lang = document.getElementById("dev_lang"); // 방의 언어 방식 select

// 방 만들기 버튼 함수
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const room_name = $room_name.value;
  const chatRoomMethod = $chatRoomMethod.value;
  const dev_lang = $dev_lang.value;
  console.log(chatRoomMethod);
  const nickname = "멘토가 되고싶은 자, 나에게로"; // 닉네임 DB 연결 대기중
  localStorage.setItem("roomName", room_name); // frontChat과 roomName을 공유하기위해서 localStorage에 저장

  chatSocket.emit("create_room", {
    room_name: room_name,
    chatRoomMethod: chatRoomMethod,
    dev_lang: dev_lang,
  });

  console.log("방 핸들 활성화");
  chatSocket.emit("enter_room", {
    room_name: room_name,
    nickname: nickname,
    chatRoomMethod: chatRoomMethod,
    dev_lang: dev_lang,
  });

  chatSocket.emit("welcome", { room_name: room_name, nickname: nickname });

  setTimeout(() => {
    const newUrl = `${
      window.location.origin
    }/CodeChat/chatroom/${encodeURIComponent(room_name)}`;
    window.location.href = newUrl;
  }, 5000);
};
// 방 만들기 버튼  함수 끝
// 방 만들기 버튼 클릭 시
$make_room_form.addEventListener("submit", handleRoomSubmit);

// 방 목록에 새로운 방 추가하는 함수
const addRoomToTable = (room) => {
  console.log("addRoomToTable 함수 작동");
  const newRow = document.createElement("tr");
  newRow.id = "room_" + room.room_number;

  // 방 정보를 td에 추가
  newRow.innerHTML = `
    <td>${room.room_number}</td>
    <td>${room.chatRoomMethod}</td>
    <td>${room.dev_lang}</td>
    <th>
      <a href="#">${room.room_name}</a>
      <p>테스트</p>
     </th>
    <td>${room.createdBy}</td>
    <td>${room.createdDate}</td>
`;

  // 새로운 행을 테이블의 맨 위에 추가
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  $tbody.prepend(newRow);
};

chatSocket.on("update_room_list", (rooms) => {
  console.log(rooms);
  console.log("update_room_list 이벤트 프론트로 도착");
  for (const room of rooms) {
    addRoomToTable(room);
  }
});
