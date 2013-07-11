#pragma strict

public var WeaponCount : uint;
public var Weapons = new Weapon[WeaponCount];
public var CurrentWeaponIndex : uint;

function Start () 
{
	
}

function LateUpdate () 
{
	Weapons[CurrentWeaponIndex].transform.position = transform.position + transform.rotation * Vector3(0.25, -0.25, 0.25);
	Weapons[CurrentWeaponIndex].transform.rotation = transform.rotation;
	Weapons[CurrentWeaponIndex].transform.localEulerAngles.z *= 0;
	if(Input.GetButtonDown("Fire1"))
	{
		Weapons[CurrentWeaponIndex].SendMessage("StartFiring", null);
	}
	if(Input.GetButtonUp("Fire1"))
	{
		Weapons[CurrentWeaponIndex].SendMessage("StopFiring", null);
	}
}
