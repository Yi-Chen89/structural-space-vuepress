<template>
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>I-Shaped</th>
          <th>Channel</th>
          <th>RHS</th>
          <th>CHS</th>
          <th>Tee</th>
          <th>2L</th>
          <th>L</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="row-header">Compression</td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="row-header">Flexure Major</td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="row-header">Flexure Minor</td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="row-header">Shear Major</td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td><span v-html="check"></span></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="row-header">Shear Minor</td>
          <td></td>
          <td></td>
          <td></td>
          <td><span v-html="check"></span></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      check: "<strong>&check;</strong>"
    };
  }
};
</script>

<style scoped>
  .row-header {
    font-weight: bold;
  }

  tbody td:not(.row-header) {
    text-align: center;
  }
</style>