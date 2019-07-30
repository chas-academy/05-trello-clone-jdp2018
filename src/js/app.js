import $ from "jquery";

import sortable from "jquery-ui/ui/widgets/sortable";
import dialog from "jquery-ui/ui/widgets/dialog";
import datepicker from "jquery-ui/ui/widgets/datepicker";
// require('webpack-jquery-ui');
import "../css/styles.css";
import { deflateRaw } from "zlib";

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function() {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $(".board");
    DOM.$listDialog = $("#list-creation-dialog");
    DOM.$columns = $(".column");
    DOM.$lists = $(".list");
    DOM.$cards = $(".card");

    DOM.$newListButton = $("button#new-list");
    DOM.$deleteListButton = $(".list-header > button.delete");

    DOM.$newCardForm = $("form.new-card");
    DOM.$deleteCardButton = $(".card > button.delete");
  }

  function createTabs() {}
  

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on("click", createList);
    DOM.$deleteListButton.on("click", deleteList);

    DOM.$newCardForm.on("submit", createCard);
    DOM.$deleteCardButton.on("click", deleteCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    var copyList = DOM.$columns
      .last()
      .prev()
      .clone(true);
    copyList.prependTo(DOM.$columns.last());
  }

  function deleteList() {
    var toRemove = $(this).closest(".column");
      $("#dialog").dialog({
        autoOpen: true,
        title: "Are You Sure?",
        show: {
          effect: "blind",
          duration: 1000
        },
        hide: {
          effect: "explode",
          duration: 1000
        },
        buttons: [
          {
            text: "yes",
            click: function() {
              $(this).dialog("close");
              toRemove.remove();
            }
          },
          {
            text: "no",
            click: function() {
              $(this).dialog("close");
            }
          }
        ]
      });
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    var title = $(this).children()[0].value;
    var button = $("<button class='button delete'>X</button>");
    button.on("click", deleteCard);
    var liElement = $("<li class='card'></li>").html(button);
    liElement.prepend(title);
    $(this)
      .parents("ul.list-cards")
      .append(liElement);
  }

  function deleteCard() {
    $(this)
      .parent()
      .slideToggle("explode");
  }

  function sortable() {
    $(".list-cards").sortable({ connectWith: ".list-cards" });
    $(".board").sortable({ connectWith: ".board" });
  }
  $(".colorButton").click(function() {
    const randomColor = Math.floor(Math.random() * 255);
    const color = "#" + randomColor;
    $("body").css("background-color", color);
  });

  function datePicker(){
    $('input').filter('.datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
    })
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(":::: Initializing JTrello ::::");
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    sortable();
    bindEvents();
    datePicker();
  }
  return {
    init: init
  };
})();

$("document").ready(function() {
  jtrello.init();
});
