import { createRouter, createWebHistory } from "vue-router";
import EventList from "@/views/EventList.vue";
import EventLayout from "@/views/event/Layout.vue";
import EventDetails from "@/views/event/Details.vue";
import EventRegister from "@/views/event/Register.vue";
import EventEdit from "@/views/event/Edit.vue";
import NotFound from "@/views/NotFound.vue";
import NetworkError from "@/views/NetworkError.vue";
import About from "@/views/About.vue";
import EventService from "@/services/EventService.js";
import GStore from "@/store";
import NProgress from "nprogress";

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
    props: route => ({ page: parseInt( route.query.page) || 1 })
  },

  {
    path: "/event/:id",
    name: "EventLayout",
    props: true,
    component: EventLayout,
    beforeEnter: to => {
      // fetch event (by id) and set local event data
      return EventService.getEvent(to.params.id)
      .then((response) => {
        GStore.event = response.data;
      })
      .catch((error) => {
        console.log(error);

        if (error.response && error.response.status == 404) {
          return{
            name: "404Resource",
            params: { resource: "event"}
          };
        } else {
          return{ name: "NetworkError"};
        }
      });
    },
    children: [
      {
        path: "",
        name: "EventDetails",
        component: EventDetails,
      },
      {
        path: "register",
        name: "EventRegister",
        component: EventRegister
      },
      {
        path: "edit",
        name: "EventEdit",
        component: EventEdit
      },
    ]
  },

  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () =>
    //  import(/* webpackChunkName: "about" */ "../views/About.vue"),
    component: About,
  },

  // Errors
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },

  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
  },

  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach( () => {
  NProgress.start();
});

router.afterEach( () => {
  NProgress.done();
});

export default router;
