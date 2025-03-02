<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let searchQuery = "";
    let filterAuction = true;
    let filterBuyItNow = true;
    let sortBy = 'best-match';
    let pageNumber = 1;
    let minPrice = "";
    let maxPrice = "";
    let loading = false;
    let condition = "";
    console.log('🔄 [Client] Debug: Components and variables initialized');

    function watchVariable(varName: string, callback: () => void) {
        let obj = new Proxy({ [varName]: false }, {
            set(target, key, value) {
                if (key === varName && value === true) {
                    callback();
                    target[key as string] = false;
                } else {
                    target[key as string] = value;
                }
                return true;
            }
        });
        return obj;
    }

    function buildConditionString() {
        const checkedBoxes = document.querySelectorAll('.condition-box:checked') as NodeListOf<HTMLInputElement>;
    
        // Map the checked boxes to their data-id values
        const conditionIds = Array.from(checkedBoxes)
            .map(box => box.getAttribute('data-id'))
            .filter(id => id !== null && id !== "")
            .join('|');
        
        const condition = conditionIds.replace(/\|{2,}/g, '|');
        console.log(`[Client] Debug: Condition String: ${condition}`)
        // Clean up any consecutive pipes
        return condition
    }

function handleSubmit() {
    if (searchQuery === '') { 
        alert(`Error: no search query entered.`)
    } else { 
        pageNumber = 1; // Reset page number on new search
        loading = true;

        let filter = '';
        if (filterAuction === filterBuyItNow) {
            filter = 'all';
        } else if (filterAuction) {
            filter = 'auction';
        } else if (filterBuyItNow) {
            filter = 'buy-it-now';
        }

        // Build the condition string during form submission
        condition = buildConditionString();
        
        const queryParams = new URLSearchParams({
            search: searchQuery,
            filter: filter,
            sort: sortBy,
            page: pageNumber.toString(),
            minPrice: minPrice,
            maxPrice: maxPrice,
            condition: condition,
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
        // let isFiltersAccordionOpen = false;
        // const filtersAccordionTitle = document.querySelector("#section-title-filters");
        // const filtersAccordionContent = document.querySelector("#section-content-filters") as HTMLElement;
        // const filtersAccordionIcon = document.querySelector("#filters-accordion-chevron") as HTMLElement;

        // if (filtersAccordionTitle && filtersAccordionContent && filtersAccordionIcon) {
        //     console.log(`[Client] Debug: DOM Elements for accordion "Search Filters" Found!`)
        //     filtersAccordionTitle.addEventListener("click", () => {
        //         console.log(`[Client] Debug: EventListener: Accordion "Search Filters" Clicked`)
        //         isFiltersAccordionOpen = !isFiltersAccordionOpen;
                
        //         if (isFiltersAccordionOpen) {
        //             filtersAccordionContent.style.maxHeight = `${filtersAccordionContent.scrollHeight}px`;
        //             filtersAccordionIcon.style.transform = "rotate(90deg)";
        //             filtersAccordionContent.classList.add("active");
        //             console.log(`[Client] Debug: Accordion "Search Filters" Opened`)
        //         } else {
        //             filtersAccordionContent.style.maxHeight = "0";
        //             filtersAccordionIcon.style.transform = "rotate(0deg)";
        //             filtersAccordionContent.classList.remove("active");
        //             console.log(`[Client] Debug: Accordion "Search Filters" Closed`)
        //         }
        //     });
        // } else { console.error(`[Client] Debug: DOM Elements for accordion "Search Filters" not found`) }

        let isFiltersAccordionOpen = false;
        const filtersAccordionTitle = document.querySelector("#section-title-filters");
        const filtersAccordionContent = document.querySelector("#section-content-filters") as HTMLElement;
        const filtersAccordionIcon = document.querySelector("#filters-accordion-chevron") as HTMLElement;

        if (filtersAccordionTitle && filtersAccordionContent && filtersAccordionIcon) {
            const adjustAccordionHeight = () => {
                if (isFiltersAccordionOpen) {
                    filtersAccordionContent.style.maxHeight = `${filtersAccordionContent.scrollHeight}px`;
                } else {
                    filtersAccordionContent.style.maxHeight = "0";
                }
            };

            filtersAccordionTitle.addEventListener("click", () => {
                isFiltersAccordionOpen = !isFiltersAccordionOpen;

                if (isFiltersAccordionOpen) {
                    filtersAccordionIcon.style.transform = "rotate(90deg)";
                    filtersAccordionContent.classList.add("active");
                } else {
                    filtersAccordionIcon.style.transform = "rotate(0deg)";
                    filtersAccordionContent.classList.remove("active");
                }

                adjustAccordionHeight();
            });

            const resizeObserver = new ResizeObserver(() => {
                if (isFiltersAccordionOpen) {
                    adjustAccordionHeight();
                }
            });

            resizeObserver.observe(document.querySelector("#text-filters") as HTMLElement);

        } else { console.error(`[Client] Debug: DOM Elements for accordion "Search Filters" not found`); }
       

        // checkbox shit 2.0
        function updateMainCheckboxState(mainCheckbox: HTMLInputElement, subCheckboxes: NodeListOf<HTMLInputElement>) {
            const checkedCount = Array.from(subCheckboxes).filter(checkbox => checkbox.checked).length;

            if (checkedCount === subCheckboxes.length) {
                mainCheckbox.checked = true;
                mainCheckbox.indeterminate = false;
            } else if (checkedCount === 0) {
                mainCheckbox.checked = false;
                mainCheckbox.indeterminate = false;
            } else {
                mainCheckbox.checked = false;
                mainCheckbox.indeterminate = true;
            }
        }

        function setupCheckboxSync(mainId: string, subClass: string) {
            const mainCheckbox = document.getElementById(mainId) as HTMLInputElement;
            const subCheckboxes = document.querySelectorAll<HTMLInputElement>(subClass);

            if (!mainCheckbox) return;

            mainCheckbox.addEventListener('change', () => {
                subCheckboxes.forEach(checkbox => {
                checkbox.checked = mainCheckbox.checked;
                });
            });

            subCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => updateMainCheckboxState(mainCheckbox, subCheckboxes));
            });
        }

        setupCheckboxSync('new-condition', '.other-new-condition');
        setupCheckboxSync('refurbished-condition', '.other-refurbished-condition');
        setupCheckboxSync('used-condition', '.other-used-condition');

        document.querySelectorAll('.condition-box').forEach(box => {
            if (box.id !== 'notworking-condition') {
                (box as HTMLInputElement).checked = true;
            }
        });

        // Checkbox Accordions
        const carets = document.getElementsByClassName("condition-accordion-caret");
        let index;
        for (index = 0; index < carets.length; index++) {
            carets[index].addEventListener("click", function(this: HTMLElement) {
                // const panel = this.nextElementSibling as HTMLElement;
                let panel = this.nextElementSibling as HTMLElement | null;
                while (panel && !panel.classList.contains("panel")) {
                    panel = panel.nextElementSibling as HTMLElement | null;
                }

                if (panel && panel.style.display === "block") {
                    panel.style.display = "none";
                    this.style.transform = "rotate(0deg)"
                } else {
                    panel.style.display = "block";
                    this.style.transform = "rotate(180deg)"
                }
            });
        }

        
    }); // onMount closing brace
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
    <div class="accordio">
        <div class="section">
            <div class="section-title-filters" id="section-title-filters"><i id="filters-accordion-chevron" class="fa-solid fa-chevron-right" aria-hidden="true"></i>&nbsp;&nbsp;Search Filters</div>
            <div class="section-content-filters" id="section-content-filters"> 
                <div class="text" id="text-filters">
                    <br>
                    <label for="listing-type">Listing Type:</label>
                    <div id="listing-type">
                        <label>
                            <input class="listingtypecheckboxes" type="checkbox" bind:checked={filterAuction}>
                            Auction
                        </label>
                        <br>
                        <label>
                            <input class="listingtypecheckboxes" type="checkbox" bind:checked={filterBuyItNow}>
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
                    
                    <br>
                    <label for="condition-boxes">Item Conditions:</label>
                    <div id="condition-boxes">

                        <label> <!-- "New" checkbox - Category -->
                            <input type="checkbox" id="new-condition" class="condition-box" data-id="1000">
                            New&nbsp;&nbsp;
                        </label><div class="fa-solid fa-caret-down condition-accordion-caret inline-block"></div>
                        <br>
                        <div class="panel">
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-new-condition" data-id="1500">
                                Open Box
                            </label>
                            <br>
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-new-condition" data-id="1750">
                                New (with defects)
                            </label>
                            <br>
                        </div>

                        <label> <!-- "Refurbished" checkbox - Category -->
                            <input type="checkbox" id="refurbished-condition" class="condition-box" data-id="">
                            Refurbished&nbsp;&nbsp;
                        </label><div class="fa-solid fa-caret-down condition-accordion-caret inline-block"></div>
                        <br>
                        <div class="panel">
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-refurbished-condition" data-id="2000">
                                Certified Refurbished
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-refurbished-condition" data-id="2010">
                                Excellent - Refurbished
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-refurbished-condition" data-id="2020">
                                Very Good - Refurbished
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-refurbished-condition" data-id="2030">
                                Good - Refurbished
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-refurbished-condition" data-id="2500">
                                Refurbished by Seller
                            </label>
                            <br>
                        </div>

                        <label> <!-- "Used" checkbox - Category -->
                            <input type="checkbox" id="used-condition" class="condition-box" data-id="">
                            Used&nbsp;&nbsp;
                        </label><div class="fa-solid fa-caret-down condition-accordion-caret inline-block"></div>
                        <br>
                        <div class="panel">
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-used-condition" data-id="2750">
                                Used - Like New
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-used-condition" data-id="2990|3000">
                                Used - Excellent
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-used-condition" data-id="3010|4000">
                                Used - Very Good
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-used-condition" data-id="5000">
                                Used - Good
                            </label>
                            <br>                    
                            <label>
                                <input type="checkbox" class="condition-box indented-condition-box other-used-condition" data-id="6000">
                                Used - Fair
                            </label>
                            <br>
                        </div>

                        <label>
                            <input type="checkbox" id="notworking-condition" class="condition-box" data-id="7000">
                            For parts or not working
                        </label>
                        <br>                
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button type="submit" style="margin-top: 35px !important;" class="searchbutton" on:click={handleSubmit}>Search</button>
    {#if loading}
        <br>
        <p class="warning" style="text-align: center !important;">Loading...</p>
    {/if}
</div>