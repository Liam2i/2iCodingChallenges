using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NotSquareHole : MonoBehaviour, IHole
{
    public void GetClicked() {
		GameController.gameController.RemoveLife();
    }
}
