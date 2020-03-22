using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class coolHexagonController : MonoBehaviour
{
    public float shrinkSpeed = 3f;
    public float rotateSpeed = 30f;
    private float baseScale = 1f;
    private void Start()
    {
        baseScale = transform.localScale.x;
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        transform.Rotate(Vector3.forward, Time.deltaTime * -rotateSpeed);
    }
    void Update()
    {
        transform.localScale -= Vector3.one * shrinkSpeed * Time.deltaTime;

        if (transform.localScale.x <= .5f )
            transform.localScale = Vector3.one * 18f;
    }
}
