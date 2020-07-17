import axios from "axios";
import { createPopper } from "@popperjs/core";
var currentTemplateNumber;
var currentImageInSlideShow;
var popperInstance;
var currentTemplateIdentifier;

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

function addArrowStyles(document, templates) {
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
  var css = document.createElement("style");
  css.type = "text/css";

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
}

function destroyPopper() {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
}

export const showTemplate = async (document, templates, sliceIndex) => {
  if (templates.length > 0) {
    window.addEventListener("popstate", function (event) {
      if (templates !== [] && currentTemplateNumber !== -1) {
        console.log(currentTemplateIdentifier);
        if (
          document.getElementsByClassName(currentTemplateIdentifier).length > 0
        ) {
          let previousTarget = document.getElementsByClassName(
            currentTemplateIdentifier
          )[0];
          previousTarget.classList.remove("Template-Active-Element");
        }

        if (document.getElementById("Overlay-" + currentTemplateIdentifier)) {
          document
            .getElementById("Overlay-" + currentTemplateIdentifier)
            .remove();
        }
        if (document.getElementById("Template-" + currentTemplateIdentifier)) {
          document
            .getElementById("Template-" + currentTemplateIdentifier)
            .remove();
        }
        currentTemplateNumber = -1;
      }
    });
    currentTemplateNumber = -1;
    var newTemplateFrame = document.createElement("iframe");
    newTemplateFrame.setAttribute("frameborder", "0");
    newTemplateFrame.setAttribute("scrolling", "no");
    newTemplateFrame.setAttribute("onload", "resizeIframe(this)");

    document.body.append(newTemplateFrame);

    let link = document.createElement("link");

    link.href = "https://dl.dropbox.com/s/i9lrx274ne7wxtu/global-iframe.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    newTemplateFrame.contentWindow.document.head.appendChild(link);
    nextTemplate(document, templates.slice(0, sliceIndex), newTemplateFrame);
  }
};

export const nextTemplate = async (document, templates, newTemplateFrame) => {
  destroyPopper();
  newTemplateFrame.contentWindow.document.body.innerHTML = "";

  newTemplateFrame.removeAttribute("style");
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
    //clicks on finish
    if (currentTemplateNumber === templates.length - 1) {
      currentTemplateNumber = -1;
      newTemplateFrame.remove();
      return;
    }
  }

  currentTemplateNumber = currentTemplateNumber + 1;

  if (currentTemplateNumber !== templates.length) {
    if (templates[currentTemplateNumber].toolTip === true) {
      var Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
    }

    newTemplateFrame.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    currentTemplateIdentifier = templates[currentTemplateNumber].identifier;
    newTemplateFrame.contentWindow.document.body.innerHTML +=
      templates[currentTemplateNumber].DOMString;

    newTemplateFrame.style.padding = "-5px";
    newTemplateFrame.style.height = "60vh";
    newTemplateFrame.style.width = "60vh";
    newTemplateFrame.style.border = "none";
    newTemplateFrame.style.borderRadius = "4%";
    newTemplateFrame.style.borderRadius = "4%";
    newTemplateFrame.style.zIndex = "2147483647";

    if (templates[currentTemplateNumber].toolTip === true) {
      addArrowStyles(document, templates);

      newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.backgroundColor = "white";
      newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.borderRadius = "8px";
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

      popperInstance = createPopper(Target, newTemplateFrame, {
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

    var button = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Next-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates, newTemplateFrame);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Previous-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates, newTemplateFrame);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow(document, templates);
      };

      var nextSlideShowImageButton = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow(document, templates);
      };
    }

    setTimeout(function () {
      if (templates[currentTemplateNumber].toolTip === true) {
        newTemplateFrame.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  }
};

export const previousTemplate = async (
  document,
  templates,
  newTemplateFrame
) => {
  destroyPopper();
  newTemplateFrame.contentWindow.document.body.innerHTML = "";
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

    newTemplateFrame.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    currentTemplateIdentifier = templates[currentTemplateNumber].identifier;
    newTemplateFrame.contentWindow.document.body.innerHTML +=
      templates[currentTemplateNumber].DOMString;

    newTemplateFrame.style.padding = "-5px";
    newTemplateFrame.style.height = "60vh";
    newTemplateFrame.style.width = "60vh";
    newTemplateFrame.style.border = "none";
    newTemplateFrame.style.borderRadius = "4%";
    newTemplateFrame.style.borderRadius = "4%";
    newTemplateFrame.style.zIndex = "2147483647";

    if (templates[currentTemplateNumber].toolTip === true) {
      addArrowStyles(document, templates);

      newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.backgroundColor = "white";
      newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "SuperParentComponent"
      )[0].style.borderRadius = "8px";
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

      popperInstance = createPopper(Target, newTemplateFrame, {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
      newTemplateFrame.scrollIntoView({
        behavior: "smooth",
      });
    }

    var button = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Next-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates, newTemplateFrame);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Previous-Template-Button"
    );
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates, newTemplateFrame);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow(document, templates);
      };

      var nextSlideShowImageButton = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow(document, templates);
      };
    }
    setTimeout(function () {
      if (templates[currentTemplateNumber].toolTip === true) {
        newTemplateFrame.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  }
};

const nextImageInSlideShow = (document, templates) => {
  var newTemplateFrame = document.getElementById(
    "Template-" + templates[currentTemplateNumber].identifier
  );
  const imagesInSlideShow = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
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
  var newTemplateFrame = document.getElementById(
    "Template-" + templates[currentTemplateNumber].identifier
  );
  const imagesInSlideShow = newTemplateFrame.contentWindow.document.body.getElementsByClassName(
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
