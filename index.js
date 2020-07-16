import axios from "axios";
import { createPopper } from "@popperjs/core";
var currentTemplateNumber;
var currentImageInSlideShow;
export const dataLoader = async (groupId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let requestBody = JSON.stringify({
      query: `
        query {
          getAllTemplatesInGroup(groupId: "${groupId}") {
             templates
          }
        }

        `,
    });

    const res = await axios.post(
      "http://localhost:5000/graphql",
      requestBody,
      config
    );
    return res.data.data.getAllTemplatesInGroup.templates;
  } catch (error) {
    console.log(error.response);
  }
  return "success function pass";
};

export const showTemplate = async (document, templates, sliceIndex) => {
  currentTemplateNumber = -1;
  var newTemplateDiv = document.createElement("iframe");
  document.body.append(newTemplateDiv);

  let link = document.createElement("link");

  link.href = "https://dl.dropbox.com/s/no65puvrd19bet1/global.css";
  link.rel = "stylesheet";
  link.type = "text/css";
  newTemplateDiv.contentWindow.document.head.appendChild(link);

  nextTemplate(document, templates.slice(0, sliceIndex), newTemplateDiv);
};

export const nextTemplate = async (document, templates, newTemplateDiv) => {
  newTemplateDiv.contentWindow.document.body.innerHTML = "";
  newTemplateDiv.removeAttribute("style");
  //remove previous Template from screen
  if (currentTemplateNumber !== -1) {
    if (
      document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      ).length > 0
    ) {
      let previousTarget = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      previousTarget.classList.remove("Template-Active-Element");
    }

    if (
      document.getElementById(
        "Overlay-" + templates[currentTemplateNumber].identifier
      )
    ) {
      document
        .getElementById(
          "Overlay-" + templates[currentTemplateNumber].identifier
        )
        .remove();
    }
  }

  currentTemplateNumber = currentTemplateNumber + 1;

  if (currentTemplateNumber !== templates.length) {
    if (templates[currentTemplateNumber].toolTip === true) {
      var Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
    }

    newTemplateDiv.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    newTemplateDiv.contentWindow.document.body.innerHTML +=
      templates[currentTemplateNumber].DOMString;

    newTemplateDiv.style.padding = "-5px";
    newTemplateDiv.style.height = "100vh";
    newTemplateDiv.style.width = "100vh";
    newTemplateDiv.style.border = "none";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.zIndex = "2147483647";

    if (templates[currentTemplateNumber].toolTip === true) {
      var styles = `
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="top"] > #arrow {
      bottom: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="bottom"] > #arrow {
      top: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="left"] > #arrow {
      right: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="right"] > #arrow {
      left: -4px;
    }
`;

      let link = document.createElement("link");

      link.href = "https://dl.dropbox.com/s/zlryw0p6ocnvgu3/global.css";
      link.rel = "stylesheet";
      link.type = "text/css";

      newTemplateDiv.contentWindow.document.body.appendChild(link);
      newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.backgroundColor = "white";
      newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.borderRadius = "8px";

      newTemplateDiv.contentWindow.document.body.innerHTML +=
        "<style>" + styles + "</style>";

      // var styleSheet = document.createElement("style");
      // styleSheet.type = "text/css";
      // styleSheet.innerText = styles;
      // newTemplateDiv.contentWindow.document.body.appendChild(styleSheet);
    }

    //overlay div
    var overlayDiv = document.createElement("div");
    overlayDiv.id = "Overlay-" + templates[currentTemplateNumber].identifier;
    overlayDiv.style.position = "fixed";
    overlayDiv.style.display = "block";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.right = "0";
    overlayDiv.style.bottom = "0";
    overlayDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
    overlayDiv.style.zIndex = "2147483646";
    document.body.append(overlayDiv);

    //Template is an overlay
    if (templates[currentTemplateNumber].overLay === true) {
      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );
      Template.style.position = "fixed";
      Template.style.top = "20%";
      Template.style.left = "36.5%";
    }

    //Template is a tooltip
    if (templates[currentTemplateNumber].toolTip === true) {
      const Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      Target.classList.add("Template-Active-Element");

      createPopper(Target, newTemplateDiv, {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    }

    var button = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Next-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates, newTemplateDiv);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Previous-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates, newTemplateDiv);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow(document, templates);
      };

      var nextSlideShowImageButton = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow(document, templates);
      };
    }
  }
  // document.body.innerHTML += "<div id='arrow' data-popper-arrow></div>";
};

export const previousTemplate = async (document, templates, newTemplateDiv) => {
  newTemplateDiv.contentWindow.document.body.innerHTML = "";
  newTemplateDiv.removeAttribute("style");
  //remove previous Template from screen
  if (currentTemplateNumber !== -1) {
    if (
      document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      ).length > 0
    ) {
      let previousTarget = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      previousTarget.classList.remove("Template-Active-Element");
    }

    if (
      document.getElementById(
        "Overlay-" + templates[currentTemplateNumber].identifier
      )
    ) {
      document
        .getElementById(
          "Overlay-" + templates[currentTemplateNumber].identifier
        )
        .remove();
    }
  }

  currentTemplateNumber = currentTemplateNumber - 1;

  if (currentTemplateNumber !== -1) {
    if (templates[currentTemplateNumber].toolTip === true) {
      var Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
    }

    newTemplateDiv.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    newTemplateDiv.contentWindow.document.body.innerHTML +=
      templates[currentTemplateNumber].DOMString;

    newTemplateDiv.style.padding = "-5px";
    newTemplateDiv.style.height = "100vh";
    newTemplateDiv.style.width = "100vh";
    newTemplateDiv.style.border = "none";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.zIndex = "2147483647";

    if (templates[currentTemplateNumber].toolTip === true) {
      var styles = `
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="top"] > #arrow {
      bottom: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="bottom"] > #arrow {
      top: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="left"] > #arrow {
      right: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="right"] > #arrow {
      left: -4px;
    }
`;

      let link = document.createElement("link");

      link.href = "https://dl.dropbox.com/s/zlryw0p6ocnvgu3/global.css";
      link.rel = "stylesheet";
      link.type = "text/css";

      newTemplateDiv.contentWindow.document.body.appendChild(link);
      newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.backgroundColor = "white";
      newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.borderRadius = "8px";

      newTemplateDiv.contentWindow.document.body.innerHTML +=
        "<style>" + styles + "</style>";

      // var styleSheet = document.createElement("style");
      // styleSheet.type = "text/css";
      // styleSheet.innerText = styles;
      // newTemplateDiv.contentWindow.document.body.appendChild(styleSheet);
    }

    //overlay div
    var overlayDiv = document.createElement("div");
    overlayDiv.id = "Overlay-" + templates[currentTemplateNumber].identifier;
    overlayDiv.style.position = "fixed";
    overlayDiv.style.display = "block";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.right = "0";
    overlayDiv.style.bottom = "0";
    overlayDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
    overlayDiv.style.zIndex = "2147483646";
    document.body.append(overlayDiv);

    //Template is an overlay
    if (templates[currentTemplateNumber].overLay === true) {
      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );
      Template.style.position = "fixed";
      Template.style.top = "20%";
      Template.style.left = "36.5%";
    }

    //Template is a tooltip
    if (templates[currentTemplateNumber].toolTip === true) {
      const Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      Target.classList.add("Template-Active-Element");

      createPopper(Target, newTemplateDiv, {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    }

    var button = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Next-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates, newTemplateDiv);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Previous-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates, newTemplateDiv);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow(document, templates);
      };

      var nextSlideShowImageButton = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow(document, templates);
      };
    }
  }
};

const nextImageInSlideShow = (document, templates) => {
  var newTemplateDiv = document.getElementById(
    "Template-" + templates[currentTemplateNumber].identifier
  );
  const imagesInSlideShow = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
    "Slideshow-Image-Display"
  );
  currentImageInSlideShow++;
  if (currentImageInSlideShow >= imagesInSlideShow.length)
    currentImageInSlideShow = 0;

  for (let i = 0; i < imagesInSlideShow.length; i++) {
    imagesInSlideShow[i].style.display = "none";
  }
  imagesInSlideShow[currentImageInSlideShow].style.display = "block";
};

const previousImageInSlidShow = (document, templates) => {
  var newTemplateDiv = document.getElementById(
    "Template-" + templates[currentTemplateNumber].identifier
  );
  const imagesInSlideShow = newTemplateDiv.contentWindow.document.body.getElementsByClassName(
    "Slideshow-Image-Display"
  );
  currentImageInSlideShow--;
  if (currentImageInSlideShow < 0)
    currentImageInSlideShow = imagesInSlideShow.length - 1;

  for (let i = 0; i < imagesInSlideShow.length; i++) {
    imagesInSlideShow[i].style.display = "none";
  }
  imagesInSlideShow[currentImageInSlideShow].style.display = "block";
};
