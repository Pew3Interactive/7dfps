#pragma strict

public var MaximumAmmoCount : int = 0;
public var FireRate : float;
public var FiringImpulse : float;
public var FiringAngle : float;
public var BulletHitPrefab : MeshRenderer;
public var Display : InfoDisplay;

private var TimeLeftUntilNextShotIsAllowed : float = 0;
private var IsCurrentlyFiring : boolean = false;
private var RemainingAmmo : uint;

function Start () 
{
	RemainingAmmo = MaximumAmmoCount;
}

function Update () 
{
	TimeLeftUntilNextShotIsAllowed -= Time.deltaTime;
	if(IsCurrentlyFiring && RemainingAmmo > 0 && TimeLeftUntilNextShotIsAllowed < 0)
	{
		RemainingAmmo--;
		TimeLeftUntilNextShotIsAllowed = FireRate;
		var hit : RaycastHit;
		var firingAngleX = Random.Range(0, FiringAngle);
		var firingAngleZ = Random.Range(0, 360);
		var firingVector = transform.rotation * (Quaternion.AngleAxis(firingAngleZ, Vector3.forward) * (Quaternion.AngleAxis(firingAngleX, Vector3.right) * Vector3.forward));
		if(Physics.Raycast(transform.position, firingVector, hit, 100))
		{
			var particle = Instantiate(BulletHitPrefab, hit.point, Quaternion.LookRotation(hit.normal));
			Destroy(particle, 0.1);
		}
	}
	
	Display.CurrentAmmunition = RemainingAmmo;
	Display.MaximumAmmunition = MaximumAmmoCount;
}

function StartFiring()
{
	IsCurrentlyFiring = true;
}

function StopFiring()
{
	IsCurrentlyFiring = false;
}