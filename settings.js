const deck1Cards = [];

const startGameButton =
    document.getElementById(
        "start-game"
    );

function updateDeckTotal() {

    let total = 0;

    document
        .querySelectorAll(
            ".card-count"
        )
        .forEach(label => {

            total += Number(
                label.textContent
            );
        });

    deck1Total.textContent =
        `現在 ${total} / 40枚`;

    if (total === 40) {

        deck1Total.style.color =
            "green";

        startGameButton.disabled =
            false;

    } else {

        deck1Total.style.color =
            "red";

        startGameButton.disabled =
            true;
    }
}

const deck1Total =
    document.getElementById(
        "deck1-total"
    );

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

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent = "×";

            deleteButton.style.color = "red";

            deleteButton.style.fontSize = "16px";

            deleteButton.addEventListener(
                "click",
                () => {

                    const index =
                        deck1Cards.indexOf(cardInfo);

                    if (index >= 0) {

                        deck1Cards.splice(index, 1);
                    }

                    cardRow.remove();

                    updateDeckTotal();
                }
            );

            const cardInfo = {
                file: file,
                count: 4
            };

            deck1Cards.push(cardInfo);


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

            countLabel.className =
                "card-count";

            countLabel.textContent = count;

            const plusButton =
                document.createElement("button");

            plusButton.textContent = "+";

            minusButton.style.width = "30px";
            minusButton.style.height = "30px";
            minusButton.style.fontSize = "18px";

            plusButton.style.width = "30px";
            plusButton.style.height = "30px";
            plusButton.style.fontSize = "18px";

            countLabel.style.fontSize = "20px";
            countLabel.style.fontWeight = "bold";
            countLabel.style.minWidth = "20px";
            countLabel.style.textAlign = "center";

            minusButton.addEventListener(
                "click",
                () => {

                    if (count <= 1) return;

                    count--;

                    cardInfo.count = count;

                    countLabel.textContent =
                        count;

                    updateDeckTotal();
                }
            );

            plusButton.addEventListener(
                "click",
                () => {

                    if (count >= 4) return;

                    count++;

                    cardInfo.count = count;

                    countLabel.textContent =
                        count;

                    updateDeckTotal();
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

            cardRow.appendChild(countArea);

            cardRow.appendChild(deleteButton);

            deck1List.appendChild(cardRow);

            updateDeckTotal();
        });
    }
);

function fileToBase64(file) {

    return new Promise(
        resolve => {

            const reader =
                new FileReader();

            reader.onload = () => {

                resolve(
                    reader.result
                );
            };

            reader.readAsDataURL(
                file
            );
        }
    );
}

startGameButton.addEventListener(
    "click",
    async () => {

        const deck = [];

        for (
            const cardInfo
            of deck1Cards
        ) {

            const image =
                await fileToBase64(
                    cardInfo.file
                );

            deck.push({

                image: image,

                count:
                    cardInfo.count
            });
        }

        try {

            sessionStorage.setItem(
                "deck1",
                JSON.stringify(deck)
            );

            alert("保存成功");

        } catch (e) {

            alert(
                "保存失敗\n" +
                e.message
            );
        }

        location.href =
            "index.html";
    }
);