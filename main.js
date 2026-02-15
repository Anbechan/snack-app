"use strict";

const recordSweet = document.getElementById("js-record");

let records = [
  {
    id: 1,
    title: "チョコレートパイ",
    rating: "★★",
    checkboxes: ["家族向け", "自分用"],
    comment:
      "箱型で、6個入り。中のチョロクリームも美味しく、ボリュームもあり満足感が高い。他の味もあるため、試してみたい。",
  },
  {
    id: 2,
    title: "いちごジャムクッキー",
    rating: "★★★",
    checkboxes: ["家族向け", "友人向け", "自分用"],
    comment:
      "大容量で一口サイズで満足感と手軽さがある。米粉でできているが、味はしっかりしている。カロリーを抑えて万が一食べすぎても大丈夫。",
  },
];

// タスクの生成
const createRecords = () => {
  let recordsEl = "";

  records.forEach((record) => {
    const element = record.checkboxes
      .map((text) => `<li class="mr-2">${text}</li>`)
      .join("");

    const recordEl = `
  <div id="js-record-${record.id}" class="mt-3">
    <div class="flex justify-between max-w-xs">
      <p
        id="js-record-title"
        class="text-xl font-bold text-gray-700 underline underline-offset-4 decoration-yellow-600"
      >${record.title}</p>
        <button 
          class="js-open-update-record-btn"
          data-record-id="${record.id}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </div>

      <div class="mt-1">
        <p class="text-yellow-600" id="rating-result">${record.rating}</p>
        <ul id="checkbox-result" class="text-yellow-600 mt-1 flex max-w-xs">
        ${element}
        </ul>
      </div>
      <div id="" class="mt-1 max-w-xs">
        <h4 class="text-xs font-bold text-yellow-600"></h4>
        <p id="js-record-comment" class="text-sm">${record.comment}</p>
      </div>
    </div>`;

    recordsEl += recordEl;
  });
  return { recordsEl };
};

// 記録の表示
const showRecords = () => {
  recordSweet.innerHTML = createRecords().recordsEl;
};

window.addEventListener("load", () => {
  showRecords();
});

// モーダルを表示する
const openAddRecordModalBtn = document.getElementById("js-open-add-record-btn");
const addRecordModal = document.getElementById("js-add-record-modal");
openAddRecordModalBtn.addEventListener("click", () => {
  addRecordModal.showModal();
});

// 記録を追加する
const addRecordBtn = document.getElementById("js-add-record-btn");
const addRecordTitle = document.getElementById("js-add-record-title");
const addRecordComment = document.getElementById("js-add-record-comment");

addRecordBtn.addEventListener("click", () => {
  if (!addRecordTitle.value) return;

  const selectedRating = document.querySelector('input[name="rating"]:checked');
  if (!selectedRating) return;

  const selectedCheckboxes = [
    ...document.querySelectorAll('input[name="checking"]:checked'),
  ].map((text) => text.value);

  if (!addRecordComment.value) return;
  let newId = 1;

  // recordが0を超えていた場合
  if (records.length) {
    newId = Math.max(...records.map((record) => record.id)) + 1;
  }

  const record = {
    id: newId,
    title: addRecordTitle.value,
    rating: selectedRating.value,
    checkboxes: selectedCheckboxes,
    comment: addRecordComment.value,
  };

  // 新しいrecordアイテムを追加した配列を再代入
  records = [...records, record];
  showRecords(); // タスクを再表示
  addRecordTitle.value = ""; // タイトルの入力欄を空にする
  selectedRating.checked = false; // 評価のチェックを消す
  const checkedCheckboxElements = document.querySelectorAll(
    'input[name="checking"]:checked',
  ); // checkboxのチェックを外す
  checkedCheckboxElements.forEach((checkbox) => {
    checkbox.checked = false;
  });
  addRecordComment.value = "";
});

// 編集モーダルを開く
const updateRecordModal = document.getElementById("js-update-record-modal");
const updateRecordTitle = document.getElementById("js-update-record-title");
const updateRecordComment = document.getElementById("js-update-record-comment");
let updateRecordId;
document.addEventListener("click", (r) => {
  const openUpdateRecordModalBtn = r.target.closest(
    ".js-open-update-record-btn",
  );
  if (!openUpdateRecordModalBtn) return;

  // idを取得する
  updateRecordId = Number(openUpdateRecordModalBtn.dataset.recordId);
  const record = records.find((r) => r.id === updateRecordId);

  if (!record) return;

  // 既存データをフォームに流し込む
  updateRecordTitle.value = record.title; // タイトル

  // 評価のデータ
  const updateRating = document.querySelectorAll('input[name="rating"]');
  updateRating.forEach((radio) => {
    radio.checked = radio.value === record.rating;
  });

  // チェックボックス
  const updateCheckboxes = updateRecordModal.querySelectorAll(
    'input[name="checking"]',
  );
  updateCheckboxes.forEach((checkbox) => {
    checkbox.checked = record.checkboxes.includes(checkbox.value);
  });

  // コメント
  updateRecordComment.value = record.comment;

  updateRecordModal.showModal();

  // イベントを編集・削除する
  const updateRecordBtn = document.getElementById("js-update-record-btn");
  updateRecordBtn.addEventListener("click", () => {
    //評価を編集する
    const recordRating = document.querySelector('input[name="rating"]:checked');

    // チェックボックスを編集する
    const recordCheckboxes = [
      ...document.querySelectorAll('input[name="checking"]:checked'),
    ].map((text) => text.value);

    // 編集する
    records = records.map((record) => {
      if (record.id === updateRecordId) {
        record.title = updateRecordTitle.value;
        record.rating = recordRating.value;
        record.checkboxes = recordCheckboxes;
        record.comment = updateRecordComment.value;
      }

      return record;
    });
    showRecords();
  });

  // 記録を削除する
  const delateRecordBtn = document.getElementById("js-delate-record-btn");
  delateRecordBtn.addEventListener("click", () => {
    records = records.filter((record) => record.id !== updateRecordId);
    showRecords();
  });
});
