using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SquareHole : MonoBehaviour, IHole
{
    public void GetClicked() {
        GameController.gameController.NextSection();
    }
}
