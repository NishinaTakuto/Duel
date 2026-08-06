const deck1Files =
    document.getElementById(
        "deck1-files"
    );

const deck1List =
    document.getElementById(
        "deck1-list"
    );

deck1Files.addEventListener(
    "change",
    () => {

        Array.from(
            deck1Files.files
        ).forEach(file => {

            const cardRow =
                document.createElement("div");

            cardRow.style.display = "flex";
            cardRow.style.flexDirection = "column";
            cardRow.style.alignItems = "center";
            cardRow.style.gap = "5px";

            const image =
                document.createElement("img");

            image.src =
                URL.createObjectURL(file);

            image.width = 80;

            image.height = 120;

            const fileName =
                document.createElement("div");

            fileName.textContent =
                file.name;

            /* 枚数 */

            let count = 4;

            const countArea =
                document.createElement("div");

            countArea.style.display = "flex";
            countArea.style.alignItems = "center";
            countArea.style.gap = "8px";

            const minusButton =
                document.createElement("button");

            minusButton.textContent = "-";

            const countLabel =
                document.createElement("span");

            countLabel.textContent = count;

            const plusButton =
                document.createElement("button");

            plusButton.textContent = "+";

            minusButton.addEventListener(
                "click",
                () => {

                    if (count <= 1) return;

                    count--;

                    countLabel.textContent =
                        count;
                }
            );

            plusButton.addEventListener(
                "click",
                () => {

                    if (count >= 4) return;

                    count++;

                    countLabel.textContent =
                        count;
                }
            );

            countArea.appendChild(
                minusButton
            );

            countArea.appendChild(
                countLabel
            );

            countArea.appendChild(
                plusButton
            );

            /* 画面に追加 */

            cardRow.appendChild(image);

            cardRow.appendChild(fileName);

            cardRow.appendChild(countArea);

            deck1List.appendChild(cardRow);
        });
    }
);