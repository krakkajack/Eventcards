<template>
  <h1>Events For Better</h1>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <div class = "pagination">
      <router-link
        id="page-prev"
        :to="{ name: 'EventList', query: { page: page - 1} }"
        rel="prev"
        v-if="page != 1">
        Prev Page
      </router-link>
      <router-link
        id="page-next"
        :to="{ name: 'EventList', query: { page: page + 1}}"
        rel="next"
        v-if="hasNextPage">
        Next Page
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EventCard from "../components/EventCard.vue";
import EventService from "../services/EventService.js";

export default {
  name: "EventList",
  props: ["page"],
  components: {
    EventCard,
  },

  data() {
    return {
      events: null,
      totalEvents: 0
    };
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
    .then(response => {
      next(comp => {
        comp.events = response.data;
        comp.totalEvents = response.headers["x-total-count"];
      });
    })
    .catch((error) => {
      console.log(error);

      if (error.response && error.response.status == 404) {
        next({
          name: "404Resource",
          params: { resource: "event"}
        });
      } else {
        next({ name: "NetworkError"});
      }
    });
  },

  beforeRouteUpdate(routeTo) {
    return EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
    .then(response => {
      this.events = response.data;
      this.totalEvents = response.headers["x-total-count"];
    })
    .catch( () => {
      return{ name: "NetworkError"};
    });
  },

  computed: {
    hasNextPage() {
      let totalPages = Math.ceil(this.totalEvents / 2);
      return this.page < totalPages;
    },
  },
};
</script>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination {
  display: flex;
  width: 290px;
}

.pagination a {
  flex: 1;
  font-weight:bold;
  color: #42b983;
}

#page-prev {
  text-align: left;
}

#page-next {
  text-align: right;
}
</style>
