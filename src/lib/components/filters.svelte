<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';

    let searchQuery = '';
    let filterAuction = true;
    let filterBuyItNow = true;
    let sortBy = 'best-match';
    let pageNumber = 1;
    let minPrice = '';
    let maxPrice = '';
    let noSearchQuery = false;
    let loading = false;
    console.log('🔄 [Client] Debug: Components and variables initialized');

    function handleSubmit() {
        loading = true
        if (searchQuery === '') { noSearchQuery = true } else { noSearchQuery = false }

        if (noSearchQuery == false) {
            pageNumber = 1; // Reset page number on new search

            let filter = '';
            if (filterAuction === filterBuyItNow) { // if they are both equal, that means both boxes are either unchecked or checked
                filter = 'all';
            } else if (filterAuction) {
                filter = 'auction';
            } else if (filterBuyItNow) {
                filter = 'buy-it-now';
            } else {
                console.log(`[Client] Debug: Unexpected result for 'filter': ${filter}. Defaulting to 'all'...`)
            }

            const queryParams = new URLSearchParams({
                search: searchQuery,
                filter: filter,
                sort: sortBy,
                page: pageNumber.toString(),
                minPrice: minPrice,
                maxPrice: maxPrice,
            }).toString();
            goto(`/results?${queryParams}`);
            console.log('[Client] Debug: Navigating to results page:', `/results?${queryParams}`);
        }
    }

    function handleSubmitEnter(kbdevent: KeyboardEvent) {
        if (kbdevent.key === "Enter") {
            handleSubmit()
        }
    }

    onMount(() => {
        // Accordion for Filters
        let isFiltersAccordionOpen = false;
        const filtersAccordionTitle = document.querySelector("#section-title-filters");
        const filtersAccordionContent = document.querySelector("#section-content-filters") as HTMLElement;
        const filtersAccordionIcon = document.querySelector("#filters-accordion-chevron") as HTMLElement;

        if (filtersAccordionTitle && filtersAccordionContent && filtersAccordionIcon) {
            console.log(`[Client] Debug: DOM Elements for accordion "Search Filters" Found!`)
            filtersAccordionTitle.addEventListener("click", () => {
                console.log(`[Client] Debug: EventListener: Accordion "Search Filters" Clicked`)
                isFiltersAccordionOpen = !isFiltersAccordionOpen;
                
                if (isFiltersAccordionOpen) {
                    filtersAccordionContent.style.maxHeight = `${filtersAccordionContent.scrollHeight}px`;
                    filtersAccordionIcon.style.transform = "rotate(90deg)";
                    filtersAccordionContent.classList.add("active");
                    console.log(`[Client] Debug: Accordion "Search Filters" Opened`)
                } else {
                    filtersAccordionContent.style.maxHeight = "0";
                    filtersAccordionIcon.style.transform = "rotate(0deg)";
                    filtersAccordionContent.classList.remove("active");
                    console.log(`[Client] Debug: Accordion "Search Filters" Closed`)
                }
            });
        } else { console.error(`[Client] Debug: DOM Elements for accordion "Search Filters" not found`) }
        
        // Accordion for Condition Checkboxes
        let isConditionAccordionOpen = false;
        const conditionAccordionTitle = document.querySelector("#section-title-conditions");
        const conditionAccordionContent = document.querySelector("#section-content-conditions") as HTMLElement;
        const conditionAccordionIcon = document.querySelector("#conditions-accordion-chevron") as HTMLElement;

        if (conditionAccordionTitle && conditionAccordionContent && conditionAccordionIcon) {
            console.log(`[Client] Debug: DOM Elements for accordion "Conditions" Found!`)
            conditionAccordionTitle.addEventListener("click", () => {
                console.log(`[Client] Debug: EventListener: Accordion "Conditions" Clicked`)
                isConditionAccordionOpen = !isConditionAccordionOpen;
                
                if (isConditionAccordionOpen) {
                    conditionAccordionContent.style.maxHeight = `${conditionAccordionContent.scrollHeight}px`;
                    conditionAccordionIcon.style.transform = "rotate(90deg)";
                    conditionAccordionContent.classList.add("active");
                    console.log(`[Client] Debug: Accordion "Conditions" Opened`)
                } else {
                    conditionAccordionContent.style.maxHeight = "0";
                    conditionAccordionIcon.style.transform = "rotate(0deg)";
                    conditionAccordionContent.classList.remove("active");
                    console.log(`[Client] Debug: Accordion "Conditions" Closed`)
                }
            });
        } else { console.error(`[Client] Debug: DOM Elements for accordion "Conditions" not found`) }


        // condition checkbox ai generated thingy :)

        // Get only the condition-specific checkboxes with proper type
        const boxes = document.querySelectorAll('.condition-box') as NodeListOf<HTMLInputElement>;
        const total = boxes.length;
        
        // Update function
        function updateCondition() {
        let condition = "";
        const checked = Array.from(boxes).filter(box => box.checked);
        
        // If none or all are checked, set to "all"
        if (checked.length === 0 || checked.length === total) {
            condition = "all";
        } else {
            // Join IDs with pipe
            condition = checked
            .map(box => box.getAttribute('data-id'))
            .join('|');
        }
        
        // Log with specified format
        console.log(`[Client] Debug: Condition changed: ${condition}`);
        }
        
        // Add listeners
        boxes.forEach(box => {
        box.addEventListener('change', updateCondition);
        });

        boxes.forEach(box => box.checked = true);
    });
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<div class="input-container">
    <label for="search">Search:</label>
    <input 
        type="text"
        id="search" 
        bind:value={searchQuery}
        on:input={() => console.log('📝 [Client] Debug: Search query updated:', searchQuery)} 
        on:keydown={handleSubmitEnter}
        placeholder="Enter search query..." />
    <div class="accordion">
        <div class="section">
            <div class="section-title-filters" id="section-title-filters"><i id="filters-accordion-chevron" class="fa-solid fa-chevron-right" aria-hidden="true"></i>&nbsp;&nbsp;Search Filters</div>
            <div class="section-content-filters" id="section-content-filters"> 
                <div class="text">
                    <!-- <div class="input-container"> -->
                        <label for="type"></label>
                        <div>
                            <label>
                                <input type="checkbox" bind:checked={filterAuction}>
                                Auction
                            </label>
                            <br>
                            <label>
                                <input type="checkbox" bind:checked={filterBuyItNow}>
                                Buy It Now
                            </label>
                        </div>
                
                        <!-- {#if filterAuction && !filterBuyItNow}
                            <p class="warning" style="text-align: center !important;"><span class="warning-red">Warning:</span> The auction filter might not work as expected. The issue is being investigated.</p>
                        {/if} -->
                        
                        <label class="block" for="sort" style="margin-top: 15px !important;">Sort By:</label>
                        <select class="block" id="sort" bind:value={sortBy} on:change={() => console.log('📊 [Client] Debug: Sort changed to:', sortBy)}>
                            <option value="best-match">Best Match</option>
                            <option value="price">Price + Shipping (lowest to highest)</option>
                            <option value="-price">Price + Shipping (highest to lowest)</option>
                            <option value="newly-listed">List Time (new to old)</option>
                            {#if filterAuction && !filterBuyItNow}
                                <option value="end-time">Auction End Time</option>
                            {/if}
                        </select>
                
                        <label class="block" for="minPrice" style="margin-top: 15px !important;">Min Price:</label>
                        <input class="block" type="number" id="minPrice" bind:value={minPrice} placeholder="Enter min price">
                
                        <label class="block" for="maxPrice" style="margin-top: 15px !important;">Max Price:</label>
                        <input class="block" type="number" id="maxPrice" bind:value={maxPrice} placeholder="Enter max price">
                
                        <div class="accordion">
                            <div class="section">
                                <div class="section-title-conditions" id="section-title-conditions"><i id="conditions-accordion-chevron" class="fa-solid fa-chevron-right" aria-hidden="true"></i>&nbsp;&nbsp;Conditions</div>
                                    <div class="section-content-conditions" id="section-content-conditions"> 
                                        <div class="text">
                        <label>
                            <input type="checkbox" class="condition-box" data-id="1000">
                            New
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="1500">
                            Open Box
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="1750">
                            New (with defects)
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2000">
                            Certified Refurbished
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2010">
                            Excellent - Refurbished
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2020">
                            Very Good - Refurbished
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2030">
                            Good - Refurbished
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2500">
                            Refurbished by Seller
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2750">
                            Used - Like New
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="2990|3000">
                            Used - Excellent
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="3010|4000">
                            Used - Very Good
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="5000">
                            Used - Good
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="6000">
                            Used - Fair
                          </label>
                          <br>
                          
                          <label>
                            <input type="checkbox" class="condition-box" data-id="7000">
                            For parts or not working
                          </label>
                          <br>
                          </div></div></div></div>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>

    <button type="submit" style="margin-top: 35px !important;" on:click={handleSubmit}>Search</button>
    {#if noSearchQuery}
        <br>    
        <p class="warning" style="text-align: center !important;"><span class="warning-red">Error:</span> No search query entered.</p>
    {:else if loading}
        <br>
        <p class="warning" style="text-align: center !important;">Loading...</p>
    {/if}
</div>