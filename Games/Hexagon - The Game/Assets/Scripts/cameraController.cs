using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class cameraController : MonoBehaviour
{
    public float rotateSpeed = 30f;
    // Update is called once per frame
    void FixedUpdate()
    {
        transform.Rotate(Vector3.forward, Time.deltaTime * -rotateSpeed);
    }
}
