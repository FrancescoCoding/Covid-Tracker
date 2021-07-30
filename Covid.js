class Covid {
  async getData(userInput, card, cardContainer) {
    const response = await fetch(`https://covid-api.mmediagroup.fr/v1/cases`);
    let countries = [];

    // Validate API response status
    if (response.status !== 200) {
      throw "The API is currently not working - Try again later.";
    } else {
      // Resolve promise from API
      const data = await response.json();

      // Iterate through the JSON object entries to get list of countries
      for (let country of Object.entries(data)) {
        countries.push(country[0]);
      }

      // Validate UK and US abbreviations
      const uk = /^UK$/gim;
      const us = /^US$/gim;
      const usa = /^USA$/gim;
      const taiwan = /taiwan/gim;

      if (us.test(userInput) || usa.test(userInput)) {
        userInput = "US";
      }
      if (uk.test(userInput)) {
        userInput = "United Kingdom";
      }
      if (taiwan.test(userInput)) {
        userInput = "Taiwan*";
      }

      // If the country the user inputs (capitalized) is not in the database
      if (!countries.includes(titleCase(userInput))) {
        // Create a card informing country is not in the database
        // and show list of existing countries
        card.innerHTML = `
        This country is not in our database.

        <!-- Creating a select from list input box -->

        <div class="wrapper">

          <div>
            <i class="fas fa-globe-africa pr1"></i>

            <ion-label>Country</ion-label>
          </div>
          
          <ion-select placeholder="Countries" id="select-country" mode="md" interface="action-sheet">
          ${countries.map(
            (country, index) =>
              `<ion-select-option value="${index}">${country}</ion-select-option>`
          )}
          </ion-select>
        </div>
        `;

        // Append card with validation and list of countries
        cardContainer.appendChild(card);

        // Select country input box
        const selectCountry = document.getElementById("select-country");

        // EVENT LISTENER TO COUNTRY LIST
        // Check for a change event and get that value from the array list
        selectCountry.addEventListener("ionChange", () => {
          let countryValue = countries[selectCountry.value];

          // If there is more than one region info for that country
          if (countProperties(data[`${countryValue}`]) > 1) {
            // In the existing card
            // Ask for which part
            card.innerHTML = `Which part of ${countryValue}? <br>`;

            // And output a list of the country's selected regions
            card.innerHTML += `
            <div class="wrapper">
              <div>
                <i class="fas fa-list-ul pr1"></i>
                <ion-label>Region</ion-label>
              </div>

              <ion-select placeholder="Regions" id="select-region" mode="md" interface="action-sheet">
              ${Object.keys(data[`${countryValue}`])
                .filter(reg => reg.toLowerCase() !== "unknown")
                .map(
                  (region, index) =>
                    `<ion-select-option value="${index}">${region}</ion-select-option>`
                )}
              </ion-select>
            </div>
            `;

            // Select region input box
            let selectRegion = document.getElementById("select-region");

            // EVENT LISTENER TO REGION LIST
            selectRegion.addEventListener("ionChange", () => {
              // Gets the selected region from its index
              const regionValue = Object.entries(data[`${countryValue}`])[
                selectRegion.value
              ];

              // Array containing all the information about that region
              let regionInfo = Object.entries(regionValue)[1][1];

              // Create a new card
              card.innerHTML = `
              <img src="https://source.unsplash.com/1280x720/?${
                regionValue[0] !== "All" ? regionValue[0] : countryValue
              }"/>
              <ion-card-header class="ion-no-padding">

                <ion-card-title>${countryValue} <br> <span>${
                regionValue[0]
              }</span></ion-card-title>
                <ion-card-subtitle>Updated: ${
                  regionInfo.updated !== undefined
                    ? regionInfo.updated.substring(0, 10)
                    : "Unknown"
                }</ion-card-subtitle>
              </ion-card-header>
              
              <ion-card-content>
                <div class="data"><div>Confirmed: &nbsp </div><ion-badge color="medium">${abbrev(
                  regionInfo.confirmed,
                  0
                )}</ion-badge></div>

                <div class="data"><div>Recovered: &nbsp </div><ion-badge color="success">${abbrev(
                  regionInfo.recovered,
                  0
                )}</ion-badge></div>

                <div class="data"><div>Deaths: &nbsp </div><ion-badge color="danger">${abbrev(
                  regionInfo.deaths,
                  0
                )}</ion-badge></div>
              </ion-card-content>
              `;

              // Confirm settings have been changed
              presentToast();
            });
          } else {
            let countryInfo = Object.entries(data[`${countryValue}`])[0][1];

            console.log(countryValue, "countryvalue");

            card.innerHTML = `
            <img src="https://source.unsplash.com/1280x720/?${countryValue}" />
            <ion-card-header class="ion-no-padding">

              <ion-card-title><br> <span>${titleCase(
                countryValue
              )}</span></ion-card-title>

              <ion-card-subtitle>Updated: ${
                countryInfo.updated !== undefined
                  ? countryInfo.updated.substring(0, 10)
                  : "Unknown"
              }</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="data"><div>Population: &nbsp </div><ion-badge color="secondary">${abbrev(
                countryInfo.population,
                0
              )}</ion-badge></div>

              <div class="data"><div>Confirmed: &nbsp </div><ion-badge color="medium">${abbrev(
                countryInfo.confirmed,
                0
              )}</ion-badge></div>

              <div class="data"><div>Recovered: &nbsp </div><ion-badge color="success">${abbrev(
                countryInfo.recovered,
                0
              )}</ion-badge></div>

              <div class="data"><div>Deaths: &nbsp </div><ion-badge color="danger">${abbrev(
                countryInfo.deaths,
                0
              )}</ion-badge></div>
            </ion-card-content>
            `;

            // Confirm settings have been changed
            presentToast();
          }
        });
      } else {
        // If the userInput Country exists in the database
        // and has more than entry
        if (countProperties(Object.keys(data[`${titleCase(userInput)}`])) > 1) {
          card.innerHTML = `Which part of ${titleCase(userInput)}? <br>`;

          // And output a list of the country's selected regions
          card.innerHTML += `
          <div class="wrapper">
            <div>
              <i class="fas fa-list-ul pr1"></i>
              <ion-label>Region</ion-label>
            </div>

            <ion-select placeholder="Regions" id="select-region" mode="md" interface="action-sheet">
            ${Object.keys(data[`${titleCase(userInput)}`])
              .filter(reg => reg.toLowerCase() !== "unknown")
              .map(
                (region, index) =>
                  `<ion-select-option value="${index}">${region}</ion-select-option>`
              )}
            </ion-select>
          </div>
          `;

          // Append that card
          cardContainer.appendChild(card);

          // Select region input box
          let newSelectRegion = document.getElementById("select-region");

          // Add event listener to that input
          newSelectRegion.addEventListener("ionChange", () => {
            // Select region input box value
            const newRegionValue = Object.entries(
              data[`${titleCase(userInput)}`]
            )[newSelectRegion.value];

            // Region info
            const newRegionInfo = newRegionValue[1];

            // Create a new card with the formatted info
            card.innerHTML = `
            <img src="https://source.unsplash.com/1280x720/?${
              newRegionValue[0] !== "All" ? newRegionValue[0] : userInput
            }"/>
            <ion-card-header class="ion-no-padding">

              <ion-card-title>${titleCase(userInput)} <br> <span>${
              newRegionValue[0]
            }</span></ion-card-title>
              <ion-card-subtitle>Updated: ${
                newRegionInfo.updated !== undefined
                  ? newRegionInfo.updated.substring(0, 10)
                  : "Unknown"
              }</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="data"><div>Confirmed: &nbsp </div><ion-badge color="medium">${abbrev(
                newRegionInfo.confirmed,
                0
              )}</ion-badge></div>

              <div class="data"><div>Recovered: &nbsp </div><ion-badge color="success">${abbrev(
                newRegionInfo.recovered,
                0
              )}</ion-badge></div>

              <div class="data"><div>Deaths: &nbsp </div><ion-badge color="danger">${abbrev(
                newRegionInfo.deaths,
                0
              )}</ion-badge></div>
            </ion-card-content>
            `;

            // Confirm settings have been changed
            presentToast();
          });
        } else {
          let countryInfo = Object.entries(
            data[`${titleCase(userInput)}`]
          )[0][1];

          card.innerHTML = `
            <img src="https://source.unsplash.com/1280x720/?${userInput}" />
            <ion-card-header class="ion-no-padding">

              <ion-card-title><br> <span>${titleCase(
                userInput
              )}</span></ion-card-title>

              <ion-card-subtitle>Updated: ${
                countryInfo.updated !== undefined
                  ? countryInfo.updated.substring(0, 10)
                  : "Unknown"
              }</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="data"><div>Population: &nbsp</div><ion-badge color="secondary">${abbrev(
                countryInfo.population,
                0
              )}</ion-badge></div>

              <div class="data"><div>Confirmed: &nbsp </div><ion-badge color="medium">${abbrev(
                countryInfo.confirmed,
                0
              )}</ion-badge></div>

              <div class="data"><div>Recovered: &nbsp </div><ion-badge color="success">${abbrev(
                countryInfo.recovered,
                0
              )}</ion-badge></div>

              <div class="data"><div>Deaths: &nbsp </div><ion-badge color="danger">${abbrev(
                countryInfo.deaths,
                0
              )}</ion-badge></div>
            </ion-card-content>
            `;

          // Confirm settings have been changed
          presentToast();

          // Append that card
          cardContainer.appendChild(card);
        }
      }
    }
  }
}
