<template>
  <div v-if="open" class="modal-wrapper">
    <div class="modal">
      <h2>Map settings</h2>
      <div class="num-activities">
        Activities (max 200)
        <input
          class="num-input"
          type="number"
          v-model="numActivities"
          min="1"
          max="200"
          @keydown="validateNum"
        />
        <p class="warning">
          <span style="color: #fc4c02;">Warning:</span> loading more activities
          may cause lower map responsiveness
        </p>
      </div>
      <div class="before-date">
        Before date
        <input
          class="date-input"
          type="date"
          id="birthday"
          name="birthday"
          v-model="beforeDate"
        />
      </div>
      <button
        :class="
          `save-btn${
            beforeDate === null ||
            numActivities === '' ||
            numActivities > 200 ||
            numActivities < 1
              ? ' disabled'
              : ' active'
          }`
        "
        @click="save"
      >
        Save
      </button>
      <button class="close-btn" @click="close">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    open: Boolean,
  },
  data() {
    return {
      numActivities: 1,
      beforeDate: null,
    }
  },
  methods: {
    save() {
      // Get number of activities and selected date as epoch and
      // emit data back to MapView.vue
      const date = new Date(this.beforeDate)
      const utcMilllisecondsSinceEpoch =
        date.getTime() + date.getTimezoneOffset() * 60 * 1000
      const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000)
      this.$emit('closeModal', {
        numActivities: this.numActivities,
        beforeDate: utcSecondsSinceEpoch,
      })
    },
    close() {
      this.$emit('closeModal', null)
    },
  },
}
</script>

<style scoped>
.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding-top: 10%;
}
.modal {
  background-color: white;
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 3px;
  padding: 15px 20px;
  top: 10%;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
}
h2 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 30px;
}
.num-activities {
  font-size: 16px;
  margin-bottom: 15px;
}
.num-input {
  border: 1px solid lightgray;
  border-radius: 3px;
  background-color: #f5f5f5;
}
.warning {
  font-size: 14px;
}
.before-date {
  font-size: 16px;
}
.date-input {
  border-radius: 3px;
  border: 1px solid lightgray;
  background-color: #f5f5f5;
}
button {
  width: 100%;
  font-weight: 600;
  height: 30px;
  border-radius: 3px;
  border: none;
  color: white;
}
.save-btn {
  margin-top: 25px;
}
.active {
  background-color: #fc4c02;
}
.disabled {
  background-color: #ff9e75;
  pointer-events: none;
}
.close-btn {
  margin-top: 10px;
  background-color: rgb(107, 107, 107);
}
/* Mobile only CSS */
@media only screen and (max-width: 500px) {
  .num-activities {
    font-size: 18px;
  }
  .num-input {
    height: 25px;
  }
  .before-date {
    font-size: 18px;
  }
  .date-input {
    height: 30px;
  }
  .save-btn {
    height: 40px;
  }
  .close-btn {
    height: 40px;
  }
}
</style>
