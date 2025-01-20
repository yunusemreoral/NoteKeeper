// ! Ay dizisi
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

// ! Html'den gelen elemanlar
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");


// localstorageden notları al eger boşsa dizi donder
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// güncelleme için gereken değişkenler
let isUpdate = false;
let updateId = null;

// ! Fonksiyonlar ve olay izleyicileri
// AddBox'a tıklanınca bir fonksiyon tetikle
addBox.addEventListener("click", () => {
// PopupboxContainer ve popupbox'a bir class ekle
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

      // Arka plandaki sayfa kaydırılmasını engelle

    document.querySelector("body").style.overflow = "hidden";
});

// CloseBtn'e tıklayınca popupBoxContainer ve popup'a eklenen classları kaldır
closeBtn.addEventListener("click", () => {
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    // Arka plandaki sayfa kaydırılmasını tekrardan aktif et
document.querySelector("body").style.overflow = "auto";
});

// menu kısmını ayarlayan fonskiyon
function showMenu(elem) {
    // parentelement bir elemanın kapsam eleamnına erişmek için

    // tıklanan eleamnın kapsamına eriştikten sonra buna bir class ekledik.
elem.parentElement.classList.add("show");

// tıklanan yer menu kısmı haricindeki yer ise show clasını kaldırmak
document.addEventListener("click", (e) => {
    if (e.target.tagName !='I' || e.target != elem) { 
        elem.parentElement.classList.remove("show");
    }
});
}

// wrapper kısımındaki tıklamları izle
wrapper.addEventListener("click", (e) => {
    // eger üç noktaya tıklanıldıysa
if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
showMenu(e.target);
}
// eger sil e tıklandıysa
else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinizden eminmisiniz ?");
    if(res){    // tıklanan not elamanına eriş
        const note = e.target.closest(".note");
        // not ıd eriş
        const noteId = note.dataset.id;
        // note dizisiniin dön ve ıd si noteıd'ye eşit olan eleamnı diziden kaldır
        notes = notes.filter((note) => note.id != noteId);
        
        // localstorage güncelle
        localStorage.setItem("notes", JSON.stringify(notes));
        
        // renderNotes fonksiyonunu çalıştır
        renderNotes();
        
        }
    }


// eger güncelle ikonuna tıklandıysa
else if (e.target.classList.contains("updateIcon")) {
  // tıklanılan note elemanına eriş
  const note = e.target.closest(".note");
  // note elemanının ıdsine eriş
  const noteId = parseInt(note.dataset.id);
  // note dizisi içerisindeki id'si bilinen elemanı bul
  const foundedNote = notes.find((note) => note.id == noteId);

  // popup içersindeki elemanlara note değerini ata
  form[0].value = foundedNote.title;
  form[1].value = foundedNote.description;

  // güncelleme modunu aktif et
  isUpdate = true;
  updateId = noteId;

  // popup'u aç
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  //popup içerisindeki gerekliş alanları update e göre düzenle
  popupTitle.textContent = "Update Note";
  submitBtn.textContent = "Update";
}
});



// forma bir olay izleyecisi ekle ve form içerisindeki verilere eriş

form.addEventListener("submit", (e) => {
    // form gönderildiğinde sayfanın otomatik yenilemesi engelle
    e.preventDefault();

// form içerisindeki elemanlara erişme
let titleInput = e.target[0];
let descriptionInput = e.target[1];

// form elemanlarının içerisindeki değerleri eriş
let title = titleInput.value.trim();
let description = descriptionInput.value.trim();

// eger form içinde başlık ve mesaj yoksa uyarı ver
if (!title && !description) {
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");
} 

// eger başlık ve mesaj değeri varsa gerekli bilgileri oluştur

const date = new Date();
let id = new Date().getTime();
let day = date.getDate();
let year = date.getFullYear();
let month = months[date.getMonth()];

// eger güncelleme modundaysa
if (isUpdate) {
  // güncelleme yapılacak elemanın dizisi içerisindeki indexini bul
  const noteIndex = notes.findIndex((note) => {
    return note.id == updateId;
  });
  // dizi içerisindeki yukarıda bulunan index'deki eleamnın deperlerini güncelle
  notes[noteIndex] = {
    title,
    description,
    id,
    date: `${month},${day},${year}`,
  };
// güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
  isUpdate = false;
  updateId = null;
  popupTitle.textContent = "New Note";
  submitBtn.textContent = "Add Note";
  
} else {
  // elde edilen verileri bir note objesi altında topla
  let noteInfo = {
    title,
    description,
    date: `${month},${day},${year}`,
    id,
    
};
  // noteinfo objesini notes dizisine ekle
notes.push(noteInfo);  
}

// notes dizisi localstorageye ekle
localStorage.setItem("notes", JSON.stringify(notes));


// form içindeki elemanları temizle
titleInput.value = "";
descriptionInput.value = "";
// popup ı kapat 
popupBoxContainer.classList.remove("show");
popupBox.classList.remove("show");

// Arka plandaki sayfa kaydırılmasını tekrardan aktif et
document.querySelector("body").style.overflow = "auto";
// not ekledikten sonra notları render et
renderNotes();
});

// localstorage deki verileri göre ekrana note kartlarını render eden fonksiyn

function renderNotes() {
    // eger localstorage da not verisi yoksa fomskiyonu durdur
    if (!notes) return;

    // once mevcut notları kaldır

    document.querySelectorAll(".note").forEach((li) => li.remove());

    // not dizisindeki her bir eleman için ekrana bir note kartı render et

    notes.forEach((note) => {
// data ıd yi elemanlara ıd verdik.
        let liTag = `<li class="note" data-id='${note.id}'>
        
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">${note.description}</p>
        </div>
        
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;

      // insertAdjacentElement metodu belirli bir ögeyi html elamanına göre sıralı şekilde  eklemek için kullanılır.bu metod hangi konuma ekleme yapılacak ve hangi eleman eklenecek bunu belirletmemizi ister
      addBox.insertAdjacentHTML("afterend", liTag);
    });
}

// sayfa yüklendiğinde rendernotes fonksiyonu çalıştır
document.addEventListener("DOMContentLoaded",() => renderNotes());


