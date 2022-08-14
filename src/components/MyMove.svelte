<script>
    import Loader from "../components/Loader.svelte";
      export let title = "Title";
      export let message = 'Interesting...';
      async function getMove(){
        return await fetch("/auth/my_move").then((response) => {if(response.ok) return response.text(); return "";});
      }
      
</script>
    
    <style>
      h2 {
            font-size: 2rem;
            text-align: center;
        }
        h2 {
            font-size: 1.5rem;
            text-align: center;
        }
    </style>
    <div>
      <h2>Your Move</h2>
      {#await getMove()}
      <Loader/>
        {:then my_move}
        {#if my_move == ""}
        <center>Your move has not yet been made</center>
        {:else}
        <center>Your move was on:
        <h3>{my_move}</h3> </center>
        {/if}
    {/await}
    </div>