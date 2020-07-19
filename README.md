### ShellShow-Onboard-Builder-iframeWrapper

With this library, you can create exceptional user onboarding experiences for any webpage of your website. Simply integrate the library with the the Webpage Component where you want to show. You can create different experiences for each webpage to make the user comfortable with your website features.

## Setup In React Project
 
1) Import the library in your main component, where you want to display the User Onboard Templates. 
* dataLoader -> This function is used to load all templates from a group in project.
* showTemplate -> This function is used to start the onboarding experience for a webpage.
```
import { dataLoader, showTemplate } from "shellshow-onboard-builder-iframe-wrapper";
```

2) Execute the dataLoader() function inside the ComponentDidMount lifecycle in class based component, or useEffect hook in react hooks. You also need to pass the group Id, whose templates you want to show.

An example with react hooks is given below:
We call a function "loadTemplates()" in our useEffect,to execute the dataLoader() function with async await feature. Once we receive the templates, we save it in react hooks state variable for using the templates in our website.

```
var [templates, setTemplates] = useState([]);

  const loadTemplates = async () => {
    const response = await dataLoader("5f09bba96362545b5c71eb17"); // wait till templates are fetched
    setTemplates(response); // we store fetched templated in templates hook variable
  };
  useEffect(() => {
    loadTemplates();
  }, []);
```

3) After this, bind any button(which user can click) with the showTemplates() function to start showing the templates. You need to pass the Javascript "document" object and the fetched templates for this function to work.
In the below code, we call a startTour() function when we click the button, which ultimately executes the showTemplate() function.

```
  const startTour = async (event) => {
    event.preventDefault();
    showTemplate(document, templates);
  };
```

```
  <button
        onClick={(e) => startTour(event)}
      >
        Start Tour
  </button>

```



## Setup In Vue Project
 
1) Import the library in your main component, where you want to display the User Onboard Templates. 
* dataLoader -> This function is used to load all templates from a group in project.
* showTemplate -> This function is used to start the onboarding experience for a webpage.
```
import { dataLoader, showTemplate } from "shellshow-onboard-builder-iframe-wrapper";
```

 2) Execute the dataLoader() function when the Vue Component has mounted. You also need to pass the group Id, whose templates you want to show.

An example is given below:
We call a function dataLoader() inside the asnc mounted() function of Vue Component. Once we receive the templates, we save it in Vue state variable for using the templates in our website.

```
export default {
data() {
    return {
      templates: []
    };
  },

async mounted() {
    const response = await dataLoader("5f09bba96362545b5c71eb17");
    this.templates = response;
  }
};
```

3) After this, bind any button(which user can click) with the showTemplates() function to start showing the templates. You need to pass the Javascript "document" object and the fetched templates for this function to work.
In the below code, we call a startTour() function when we click the button, which ultimately executes the showTemplate() function.
```
 <button
      v-on:click="startTour()"
    >Start Show</button>
 ```
 ```
 export default {
  
  methods: {
    startTour() {
      showTemplate(document, this.templates);
    }
  };
};

```

